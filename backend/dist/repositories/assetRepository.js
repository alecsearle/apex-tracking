"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.assetRepository = {
    async findAll(businessId) {
        return prisma_1.prisma.asset.findMany({
            where: { businessId },
            orderBy: { createdAt: "desc" },
        });
    },
    async findById(businessId, assetId) {
        return prisma_1.prisma.asset.findFirst({
            where: { id: assetId, businessId },
        });
    },
    async create(businessId, data, createdBy) {
        return prisma_1.prisma.asset.create({
            data: {
                ...data,
                purchaseDate: new Date(data.purchaseDate),
                businessId,
                createdBy,
            },
        });
    },
    async update(businessId, assetId, data) {
        const updateData = { ...data };
        if (data.purchaseDate) {
            updateData.purchaseDate = new Date(data.purchaseDate);
        }
        return prisma_1.prisma.asset.update({
            where: { id: assetId, businessId },
            data: updateData,
        });
    },
    async delete(businessId, assetId) {
        return prisma_1.prisma.asset.delete({
            where: { id: assetId, businessId },
        });
    },
    async updateStatus(assetId, status) {
        return prisma_1.prisma.asset.update({
            where: { id: assetId },
            data: { status },
        });
    },
    async findByNfcTag(businessId, nfcTagId) {
        return prisma_1.prisma.asset.findFirst({
            where: { businessId, nfcTagId },
        });
    },
    async updatePhotoUrl(assetId, photoUrl) {
        return prisma_1.prisma.asset.update({
            where: { id: assetId },
            data: { photoUrl },
        });
    },
    async updateManualUrl(assetId, manualUrl) {
        return prisma_1.prisma.asset.update({
            where: { id: assetId },
            data: { manualUrl },
        });
    },
};
