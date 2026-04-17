import { assetRepository } from "../repositories/assetRepository";
import { maintenanceRepository } from "../repositories/maintenanceRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { storageService } from "./storageService";
import { ForbiddenError, NotFoundError } from "../utils/errors";

type DueStatus = "on_track" | "due_soon" | "overdue";

/**
 * Flatten Prisma schedule relations into the shape the frontend expects:
 * { assetName, createdByName } instead of { asset: { name }, creator: { fullName } }
 */
function formatSchedule(
  schedule: {
    id: string;
    assetId: string;
    businessId: string;
    createdBy: string;
    title: string;
    description: string | null;
    triggerType: string;
    intervalHours: number | null;
    intervalDays: number | null;
    lastCompletedAt: Date | null;
    lastCompletedUsageHours: number | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    asset: { id: string; name: string; purchaseDate?: Date | null };
    creator: { id: string; fullName: string };
    dueStatus: DueStatus;
    dueInfo: string;
  }
) {
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
function formatLog(
  log: {
    id: string;
    scheduleId: string;
    assetId: string;
    businessId: string;
    completedBy: string;
    completedAt: Date;
    usageHoursAtCompletion: number | null;
    notes: string | null;
    createdAt: Date;
    completedByUser: { id: string; fullName: string };
    photos: Array<{ id: string; logId: string; photoUrl: string; createdAt: Date }>;
  }
) {
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
async function calculateDueStatus(
  schedule: {
    triggerType: string;
    intervalHours: number | null;
    intervalDays: number | null;
    lastCompletedAt: Date | null;
    lastCompletedUsageHours: number | null;
    assetId: string;
    assetPurchaseDate: Date | null;
  }
): Promise<{ dueStatus: DueStatus; dueInfo: string }> {
  if (schedule.triggerType === "usage_hours") {
    const interval = schedule.intervalHours || 0;
    const lastHours = schedule.lastCompletedUsageHours || 0;
    const totalHours = await sessionRepository.calculateTotalHours(schedule.assetId);
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

export const maintenanceService = {
  async getSchedules(businessId: string, assetId?: string) {
    const schedules = await maintenanceRepository.findAllSchedules(businessId, assetId);

    const enriched = await Promise.all(
      schedules.map(async (schedule) => {
        const { dueStatus, dueInfo } = await calculateDueStatus({
          ...schedule,
          assetPurchaseDate: schedule.asset?.purchaseDate || null,
        });
        return formatSchedule({ ...schedule, dueStatus, dueInfo });
      })
    );

    return enriched;
  },

  async getScheduleById(businessId: string, scheduleId: string) {
    const schedule = await maintenanceRepository.findScheduleById(businessId, scheduleId);
    if (!schedule) throw new NotFoundError("Maintenance schedule not found");

    const { dueStatus, dueInfo } = await calculateDueStatus({
      ...schedule,
      assetPurchaseDate: schedule.asset?.purchaseDate || null,
    });

    return formatSchedule({ ...schedule, dueStatus, dueInfo });
  },

  async createSchedule(
    businessId: string,
    data: {
      assetId: string;
      title: string;
      description?: string;
      triggerType: "usage_hours" | "time_interval";
      intervalHours?: number;
      intervalDays?: number;
    },
    userId: string
  ) {
    // Verify asset belongs to business
    const asset = await assetRepository.findById(businessId, data.assetId);
    if (!asset) throw new NotFoundError("Asset not found");

    const schedule = await maintenanceRepository.createSchedule({
      ...data,
      businessId,
      createdBy: userId,
    });

    return formatSchedule({
      ...schedule,
      dueStatus: "on_track" as DueStatus,
      dueInfo: "Just created",
    });
  },

  async updateSchedule(
    businessId: string,
    scheduleId: string,
    data: {
      title?: string;
      description?: string;
      triggerType?: "usage_hours" | "time_interval";
      intervalHours?: number;
      intervalDays?: number;
      active?: boolean;
    },
    userId: string,
    role: string
  ) {
    const existing = await maintenanceRepository.findScheduleById(businessId, scheduleId);
    if (!existing) throw new NotFoundError("Maintenance schedule not found");

    // Only the creator or an owner can update a schedule
    if (existing.createdBy !== userId && role !== "owner") {
      throw new ForbiddenError("Only the schedule creator or business owner can update this schedule");
    }

    return maintenanceRepository.updateSchedule(businessId, scheduleId, data);
  },

  async deleteSchedule(businessId: string, scheduleId: string, userId: string, role: string) {
    const existing = await maintenanceRepository.findScheduleById(businessId, scheduleId);
    if (!existing) throw new NotFoundError("Maintenance schedule not found");

    // Only the creator or an owner can delete a schedule
    if (existing.createdBy !== userId && role !== "owner") {
      throw new ForbiddenError("Only the schedule creator or business owner can delete this schedule");
    }

    return maintenanceRepository.deleteSchedule(businessId, scheduleId);
  },

  async completeSchedule(
    businessId: string,
    scheduleId: string,
    userId: string,
    data: { notes?: string; usageHoursAtCompletion?: number }
  ) {
    const schedule = await maintenanceRepository.findScheduleById(businessId, scheduleId);
    if (!schedule) throw new NotFoundError("Maintenance schedule not found");

    // For usage-hours schedules, auto-fetch the asset's current total hours if not provided
    let usageHours = data.usageHoursAtCompletion;
    if (usageHours == null && schedule.triggerType === "usage_hours") {
      usageHours = await sessionRepository.calculateTotalHours(schedule.assetId);
    }

    // Create completion log
    const log = await maintenanceRepository.createLog({
      scheduleId,
      assetId: schedule.assetId,
      businessId,
      completedBy: userId,
      notes: data.notes,
      usageHoursAtCompletion: usageHours,
    });

    // Update schedule with last completed info
    await maintenanceRepository.updateSchedule(businessId, scheduleId, {
      lastCompletedAt: new Date(),
      lastCompletedUsageHours: usageHours,
    });

    return formatLog(log);
  },

  async getLogs(businessId: string, scheduleId: string) {
    const schedule = await maintenanceRepository.findScheduleById(businessId, scheduleId);
    if (!schedule) throw new NotFoundError("Maintenance schedule not found");

    const logs = await maintenanceRepository.findLogsBySchedule(businessId, scheduleId);
    return logs.map((log) => formatLog(log));
  },

  async getDueSchedules(businessId: string) {
    const all = await this.getSchedules(businessId);
    return all.filter(
      (s) => s.active && (s.dueStatus === "overdue" || s.dueStatus === "due_soon")
    );
  },

  async addLogPhoto(
    businessId: string,
    logId: string,
    file: Buffer,
    mimeType: string
  ) {
    const log = await maintenanceRepository.findLogById(logId);
    if (!log || log.businessId !== businessId) {
      throw new NotFoundError("Maintenance log not found");
    }

    const ext = mimeType.split("/")[1] || "jpg";
    const filePath = storageService.buildPath(businessId, logId, "maint-log", ext);
    const publicUrl = await storageService.upload("maintenance", filePath, file, mimeType);

    return maintenanceRepository.addLogPhoto(logId, { photoUrl: publicUrl });
  },

  async deleteLogPhoto(businessId: string, logId: string, photoId: string) {
    const log = await maintenanceRepository.findLogById(logId);
    if (!log || log.businessId !== businessId) {
      throw new NotFoundError("Maintenance log not found");
    }

    const photo = await maintenanceRepository.findLogPhoto(photoId);
    if (!photo || photo.logId !== logId) {
      throw new NotFoundError("Photo not found");
    }

    const path = storageService.extractPath(photo.photoUrl, "maintenance");
    await storageService.delete("maintenance", path).catch(() => {});

    return maintenanceRepository.deleteLogPhoto(logId, photoId);
  },
};
