"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sopRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.sopRepository = {
    async findAll(businessId, assetId) {
        const where = { businessId };
        if (assetId) {
            where.assetId = assetId;
        }
        return prisma_1.prisma.sop.findMany({
            where,
            include: {
                creator: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },
    async findById(businessId, sopId) {
        return prisma_1.prisma.sop.findFirst({
            where: { id: sopId, businessId },
            include: {
                creator: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async create(data) {
        return prisma_1.prisma.sop.create({
            data: { ...data, source: data.source || "custom" },
            include: {
                creator: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async update(businessId, sopId, data) {
        return prisma_1.prisma.sop.update({
            where: { id: sopId, businessId },
            data,
            include: {
                creator: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async delete(businessId, sopId) {
        return prisma_1.prisma.sop.delete({
            where: { id: sopId, businessId },
        });
    },
};
