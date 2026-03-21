import { prisma } from "../config/prisma";

export const maintenanceRepository = {
  // ── Schedules ──────────────────────────────────────

  async findAllSchedules(businessId: string, assetId?: string) {
    const where: Record<string, unknown> = { businessId };
    if (assetId) where.assetId = assetId;

    return prisma.maintenanceSchedule.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true } },
        creator: { select: { id: true, fullName: true } },
        _count: { select: { logs: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findScheduleById(businessId: string, scheduleId: string) {
    return prisma.maintenanceSchedule.findFirst({
      where: { id: scheduleId, businessId },
      include: {
        asset: { select: { id: true, name: true, purchaseDate: true } },
        creator: { select: { id: true, fullName: true } },
      },
    });
  },

  async createSchedule(data: {
    assetId: string;
    businessId: string;
    createdBy: string;
    title: string;
    description?: string;
    triggerType: "usage_hours" | "time_interval";
    intervalHours?: number;
    intervalDays?: number;
  }) {
    return prisma.maintenanceSchedule.create({
      data,
      include: {
        asset: { select: { id: true, name: true } },
        creator: { select: { id: true, fullName: true } },
      },
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
      lastCompletedAt?: Date;
      lastCompletedUsageHours?: number;
    }
  ) {
    return prisma.maintenanceSchedule.update({
      where: { id: scheduleId, businessId },
      data,
    });
  },

  async deleteSchedule(businessId: string, scheduleId: string) {
    return prisma.maintenanceSchedule.delete({
      where: { id: scheduleId, businessId },
    });
  },

  // ── Logs ───────────────────────────────────────────

  async createLog(data: {
    scheduleId: string;
    assetId: string;
    businessId: string;
    completedBy: string;
    usageHoursAtCompletion?: number;
    notes?: string;
  }) {
    return prisma.maintenanceLog.create({
      data,
      include: {
        completedByUser: { select: { id: true, fullName: true } },
        photos: true,
      },
    });
  },

  async findLogsBySchedule(businessId: string, scheduleId: string) {
    return prisma.maintenanceLog.findMany({
      where: { scheduleId, businessId },
      include: {
        completedByUser: { select: { id: true, fullName: true } },
        photos: true,
      },
      orderBy: { completedAt: "desc" },
    });
  },

  async findLogById(logId: string) {
    return prisma.maintenanceLog.findUnique({
      where: { id: logId },
      include: { photos: true },
    });
  },

  async addLogPhoto(logId: string, data: { photoUrl: string; caption?: string }) {
    return prisma.maintenanceLogPhoto.create({
      data: { ...data, logId },
    });
  },

  async deleteLogPhoto(logId: string, photoId: string) {
    return prisma.maintenanceLogPhoto.delete({
      where: { id: photoId, logId },
    });
  },

  async findLogPhoto(photoId: string) {
    return prisma.maintenanceLogPhoto.findUnique({ where: { id: photoId } });
  },
};
