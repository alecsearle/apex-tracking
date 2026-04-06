"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceService = void 0;
const assetRepository_1 = require("../repositories/assetRepository");
const maintenanceRepository_1 = require("../repositories/maintenanceRepository");
const sessionRepository_1 = require("../repositories/sessionRepository");
const storageService_1 = require("./storageService");
const errors_1 = require("../utils/errors");
/**
 * Flatten Prisma schedule relations into the shape the frontend expects:
 * { assetName, createdByName } instead of { asset: { name }, creator: { fullName } }
 */
function formatSchedule(schedule) {
    const { asset, creator, ...rest } = schedule;
    return {
        ...rest,
        assetName: asset.name,
        createdByName: creator.fullName,
    };
}
/**
 * Flatten Prisma log relations into the shape the frontend expects:
 * { completedByName } instead of { completedByUser: { fullName } }
 */
function formatLog(log) {
    const { completedByUser, ...rest } = log;
    return {
        ...rest,
        completedByName: completedByUser.fullName,
    };
}
/**
 * Calculate due status for a schedule based on ARCHITECTURE.md logic:
 * - usage_hours: due when totalUsageHours >= lastCompletedUsageHours + intervalHours
 * - time_interval: due when now >= lastCompletedAt + intervalDays
 * - Due soon: within 10% of threshold
 */
async function calculateDueStatus(schedule) {
    if (schedule.triggerType === "usage_hours") {
        const interval = schedule.intervalHours || 0;
        const lastHours = schedule.lastCompletedUsageHours || 0;
        const totalHours = await sessionRepository_1.sessionRepository.calculateTotalHours(schedule.assetId);
        const threshold = lastHours + interval;
        const remaining = threshold - totalHours;
        const buffer = interval * 0.1;
        if (totalHours >= threshold) {
            return { dueStatus: "overdue", dueInfo: `Overdue by ${Math.round(totalHours - threshold)} hours` };
        }
        if (remaining <= buffer) {
            return { dueStatus: "due_soon", dueInfo: `Due in ${Math.round(remaining)} hours of use` };
        }
        return { dueStatus: "on_track", dueInfo: `${Math.round(remaining)} hours until due` };
    }
    if (schedule.triggerType === "time_interval") {
        const intervalDays = schedule.intervalDays || 0;
        const baseDate = schedule.lastCompletedAt || schedule.assetPurchaseDate || new Date();
        const dueDate = new Date(baseDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
        const now = new Date();
        const msRemaining = dueDate.getTime() - now.getTime();
        const daysRemaining = msRemaining / (24 * 60 * 60 * 1000);
        const buffer = intervalDays * 0.1;
        if (daysRemaining <= 0) {
            return { dueStatus: "overdue", dueInfo: `Overdue by ${Math.round(Math.abs(daysRemaining))} days` };
        }
        if (daysRemaining <= buffer) {
            return { dueStatus: "due_soon", dueInfo: `Due in ${Math.round(daysRemaining)} days` };
        }
        return { dueStatus: "on_track", dueInfo: `${Math.round(daysRemaining)} days until due` };
    }
    return { dueStatus: "on_track", dueInfo: "Unknown trigger type" };
}
exports.maintenanceService = {
    async getSchedules(businessId, assetId) {
        const schedules = await maintenanceRepository_1.maintenanceRepository.findAllSchedules(businessId, assetId);
        const enriched = await Promise.all(schedules.map(async (schedule) => {
            const { dueStatus, dueInfo } = await calculateDueStatus({
                ...schedule,
                assetPurchaseDate: schedule.asset?.purchaseDate || null,
            });
            return formatSchedule({ ...schedule, dueStatus, dueInfo });
        }));
        return enriched;
    },
    async getScheduleById(businessId, scheduleId) {
        const schedule = await maintenanceRepository_1.maintenanceRepository.findScheduleById(businessId, scheduleId);
        if (!schedule)
            throw new errors_1.NotFoundError("Maintenance schedule not found");
        const { dueStatus, dueInfo } = await calculateDueStatus({
            ...schedule,
            assetPurchaseDate: schedule.asset?.purchaseDate || null,
        });
        return formatSchedule({ ...schedule, dueStatus, dueInfo });
    },
    async createSchedule(businessId, data, userId) {
        // Verify asset belongs to business
        const asset = await assetRepository_1.assetRepository.findById(businessId, data.assetId);
        if (!asset)
            throw new errors_1.NotFoundError("Asset not found");
        const schedule = await maintenanceRepository_1.maintenanceRepository.createSchedule({
            ...data,
            businessId,
            createdBy: userId,
        });
        return formatSchedule({
            ...schedule,
            dueStatus: "on_track",
            dueInfo: "Just created",
        });
    },
    async updateSchedule(businessId, scheduleId, data, userId, role) {
        const existing = await maintenanceRepository_1.maintenanceRepository.findScheduleById(businessId, scheduleId);
        if (!existing)
            throw new errors_1.NotFoundError("Maintenance schedule not found");
        // Only the creator or an owner can update a schedule
        if (existing.createdBy !== userId && role !== "owner") {
            throw new errors_1.ForbiddenError("Only the schedule creator or business owner can update this schedule");
        }
        return maintenanceRepository_1.maintenanceRepository.updateSchedule(businessId, scheduleId, data);
    },
    async deleteSchedule(businessId, scheduleId, userId, role) {
        const existing = await maintenanceRepository_1.maintenanceRepository.findScheduleById(businessId, scheduleId);
        if (!existing)
            throw new errors_1.NotFoundError("Maintenance schedule not found");
        // Only the creator or an owner can delete a schedule
        if (existing.createdBy !== userId && role !== "owner") {
            throw new errors_1.ForbiddenError("Only the schedule creator or business owner can delete this schedule");
        }
        return maintenanceRepository_1.maintenanceRepository.deleteSchedule(businessId, scheduleId);
    },
    async completeSchedule(businessId, scheduleId, userId, data) {
        const schedule = await maintenanceRepository_1.maintenanceRepository.findScheduleById(businessId, scheduleId);
        if (!schedule)
            throw new errors_1.NotFoundError("Maintenance schedule not found");
        // Create completion log
        const log = await maintenanceRepository_1.maintenanceRepository.createLog({
            scheduleId,
            assetId: schedule.assetId,
            businessId,
            completedBy: userId,
            notes: data.notes,
            usageHoursAtCompletion: data.usageHoursAtCompletion,
        });
        // Update schedule with last completed info
        await maintenanceRepository_1.maintenanceRepository.updateSchedule(businessId, scheduleId, {
            lastCompletedAt: new Date(),
            lastCompletedUsageHours: data.usageHoursAtCompletion,
        });
        return formatLog(log);
    },
    async getLogs(businessId, scheduleId) {
        const schedule = await maintenanceRepository_1.maintenanceRepository.findScheduleById(businessId, scheduleId);
        if (!schedule)
            throw new errors_1.NotFoundError("Maintenance schedule not found");
        const logs = await maintenanceRepository_1.maintenanceRepository.findLogsBySchedule(businessId, scheduleId);
        return logs.map((log) => formatLog(log));
    },
    async getDueSchedules(businessId) {
        const all = await this.getSchedules(businessId);
        return all.filter((s) => s.active && (s.dueStatus === "overdue" || s.dueStatus === "due_soon"));
    },
    async addLogPhoto(businessId, logId, file, mimeType) {
        const log = await maintenanceRepository_1.maintenanceRepository.findLogById(logId);
        if (!log || log.businessId !== businessId) {
            throw new errors_1.NotFoundError("Maintenance log not found");
        }
        const ext = mimeType.split("/")[1] || "jpg";
        const filePath = storageService_1.storageService.buildPath(businessId, logId, "maint-log", ext);
        const publicUrl = await storageService_1.storageService.upload("maintenance", filePath, file, mimeType);
        return maintenanceRepository_1.maintenanceRepository.addLogPhoto(logId, { photoUrl: publicUrl });
    },
    async deleteLogPhoto(businessId, logId, photoId) {
        const log = await maintenanceRepository_1.maintenanceRepository.findLogById(logId);
        if (!log || log.businessId !== businessId) {
            throw new errors_1.NotFoundError("Maintenance log not found");
        }
        const photo = await maintenanceRepository_1.maintenanceRepository.findLogPhoto(photoId);
        if (!photo || photo.logId !== logId) {
            throw new errors_1.NotFoundError("Photo not found");
        }
        const path = storageService_1.storageService.extractPath(photo.photoUrl, "maintenance");
        await storageService_1.storageService.delete("maintenance", path).catch(() => { });
        return maintenanceRepository_1.maintenanceRepository.deleteLogPhoto(logId, photoId);
    },
};
