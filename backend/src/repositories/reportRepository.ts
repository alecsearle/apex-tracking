import { prisma } from "../config/prisma";

export const reportRepository = {
  async findAll(
    businessId: string,
    filters?: { assetId?: string; severity?: string; status?: string }
  ) {
    const where: Record<string, unknown> = { businessId };
    if (filters?.assetId) where.assetId = filters.assetId;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;

    return prisma.maintenanceReport.findMany({
      where,
      include: {
        photos: true,
        reporter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(businessId: string, reportId: string) {
    return prisma.maintenanceReport.findFirst({
      where: { id: reportId, businessId },
      include: {
        photos: true,
        reporter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async create(data: {
    assetId: string;
    sessionId?: string;
    businessId: string;
    reportedBy: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
  }) {
    return prisma.maintenanceReport.create({
      data,
      include: {
        photos: true,
        reporter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async update(
    businessId: string,
    reportId: string,
    data: {
      title?: string;
      description?: string;
      severity?: "low" | "medium" | "high" | "critical";
      status?: "open" | "in_progress" | "resolved";
    }
  ) {
    return prisma.maintenanceReport.update({
      where: { id: reportId, businessId },
      data,
      include: {
        photos: true,
        reporter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async addPhoto(reportId: string, data: { photoUrl: string; caption?: string }) {
    return prisma.reportPhoto.create({
      data: { ...data, reportId },
    });
  },

  async deletePhoto(reportId: string, photoId: string) {
    return prisma.reportPhoto.delete({
      where: { id: photoId, reportId },
    });
  },

  async findPhoto(photoId: string) {
    return prisma.reportPhoto.findUnique({ where: { id: photoId } });
  },

  async hasOpenHighSeverityReports(assetId: string): Promise<boolean> {
    const count = await prisma.maintenanceReport.count({
      where: {
        assetId,
        severity: { in: ["high", "critical"] },
        status: { not: "resolved" },
      },
    });
    return count > 0;
  },
};
