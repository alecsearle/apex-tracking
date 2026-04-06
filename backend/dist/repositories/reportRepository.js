"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.reportRepository = {
    async findAll(businessId, filters) {
        const where = { businessId };
        if (filters?.assetId)
            where.assetId = filters.assetId;
        if (filters?.severity)
            where.severity = filters.severity;
        if (filters?.status)
            where.status = filters.status;
        return prisma_1.prisma.maintenanceReport.findMany({
            where,
            include: {
                photos: true,
                reporter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async findById(businessId, reportId) {
        return prisma_1.prisma.maintenanceReport.findFirst({
            where: { id: reportId, businessId },
            include: {
                photos: true,
                reporter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async create(data) {
        return prisma_1.prisma.maintenanceReport.create({
            data,
            include: {
                photos: true,
                reporter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async update(businessId, reportId, data) {
        return prisma_1.prisma.maintenanceReport.update({
            where: { id: reportId, businessId },
            data,
            include: {
                photos: true,
                reporter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async addPhoto(reportId, data) {
        return prisma_1.prisma.reportPhoto.create({
            data: { ...data, reportId },
        });
    },
    async deletePhoto(reportId, photoId) {
        return prisma_1.prisma.reportPhoto.delete({
            where: { id: photoId, reportId },
        });
    },
    async findPhoto(photoId) {
        return prisma_1.prisma.reportPhoto.findUnique({ where: { id: photoId } });
    },
    async hasOpenHighSeverityReports(assetId) {
        const count = await prisma_1.prisma.maintenanceReport.count({
            where: {
                assetId,
                severity: { in: ["high", "critical"] },
                status: { not: "resolved" },
            },
        });
        return count > 0;
    },
};
