"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.maintenanceRepository = {
    // ── Schedules ──────────────────────────────────────
    async findAllSchedules(businessId, assetId) {
        const where = { businessId };
        if (assetId)
            where.assetId = assetId;
        return prisma_1.prisma.maintenanceSchedule.findMany({
            where,
            include: {
                asset: { select: { id: true, name: true, purchaseDate: true } },
                creator: { select: { id: true, fullName: true } },
                _count: { select: { logs: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async findScheduleById(businessId, scheduleId) {
        return prisma_1.prisma.maintenanceSchedule.findFirst({
            where: { id: scheduleId, businessId },
            include: {
                asset: { select: { id: true, name: true, purchaseDate: true } },
                creator: { select: { id: true, fullName: true } },
            },
        });
    },
    async createSchedule(data) {
        return prisma_1.prisma.maintenanceSchedule.create({
            data,
            include: {
                asset: { select: { id: true, name: true, purchaseDate: true } },
                creator: { select: { id: true, fullName: true } },
            },
        });
    },
    async updateSchedule(businessId, scheduleId, data) {
        return prisma_1.prisma.maintenanceSchedule.update({
            where: { id: scheduleId, businessId },
            data,
        });
    },
    async deleteSchedule(businessId, scheduleId) {
        return prisma_1.prisma.maintenanceSchedule.delete({
            where: { id: scheduleId, businessId },
        });
    },
    // ── Logs ───────────────────────────────────────────
    async createLog(data) {
        return prisma_1.prisma.maintenanceLog.create({
            data,
            include: {
                completedByUser: { select: { id: true, fullName: true } },
                photos: true,
            },
        });
    },
    async findLogsBySchedule(businessId, scheduleId) {
        return prisma_1.prisma.maintenanceLog.findMany({
            where: { scheduleId, businessId },
            include: {
                completedByUser: { select: { id: true, fullName: true } },
                photos: true,
            },
            orderBy: { completedAt: "desc" },
        });
    },
    async findLogById(logId) {
        return prisma_1.prisma.maintenanceLog.findUnique({
            where: { id: logId },
            include: { photos: true },
        });
    },
    async addLogPhoto(logId, data) {
        return prisma_1.prisma.maintenanceLogPhoto.create({
            data: { ...data, logId },
        });
    },
    async deleteLogPhoto(logId, photoId) {
        return prisma_1.prisma.maintenanceLogPhoto.delete({
            where: { id: photoId, logId },
        });
    },
    async findLogPhoto(photoId) {
        return prisma_1.prisma.maintenanceLogPhoto.findUnique({ where: { id: photoId } });
    },
};
