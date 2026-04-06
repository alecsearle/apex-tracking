"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetService = void 0;
const assetRepository_1 = require("../repositories/assetRepository");
const sessionRepository_1 = require("../repositories/sessionRepository");
const storageService_1 = require("./storageService");
const errors_1 = require("../utils/errors");
exports.assetService = {
    async getAll(businessId) {
        const assets = await assetRepository_1.assetRepository.findAll(businessId);
        // Compute totalUsageHours for each asset
        const enriched = await Promise.all(assets.map(async (asset) => {
            const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(asset.id);
            return { ...asset, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
        }));
        return enriched;
    },
    async getById(businessId, assetId) {
        const asset = await assetRepository_1.assetRepository.findById(businessId, assetId);
        if (!asset)
            throw new errors_1.NotFoundError("Asset not found");
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...asset, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
    async create(businessId, data, userId) {
        const asset = await assetRepository_1.assetRepository.create(businessId, data, userId);
        return { ...asset, totalUsageHours: 0 };
    },
    async update(businessId, assetId, data) {
        await this.getById(businessId, assetId); // throws if not found
        const updated = await assetRepository_1.assetRepository.update(businessId, assetId, data);
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...updated, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
    async delete(businessId, assetId) {
        const asset = await this.getById(businessId, assetId);
        // Delete files from Supabase Storage if present
        if (asset.photoUrl) {
            const path = storageService_1.storageService.extractPath(asset.photoUrl, "assets");
            await storageService_1.storageService.delete("assets", path).catch(() => { });
        }
        if (asset.manualUrl) {
            const path = storageService_1.storageService.extractPath(asset.manualUrl, "assets");
            await storageService_1.storageService.delete("assets", path).catch(() => { });
        }
        return assetRepository_1.assetRepository.delete(businessId, assetId);
    },
    async uploadPhoto(businessId, assetId, file, mimeType) {
        const asset = await this.getById(businessId, assetId);
        // Delete old photo if exists
        if (asset.photoUrl) {
            const oldPath = storageService_1.storageService.extractPath(asset.photoUrl, "assets");
            await storageService_1.storageService.delete("assets", oldPath).catch(() => { });
        }
        const ext = mimeType.split("/")[1] || "jpg";
        const filePath = storageService_1.storageService.buildPath(businessId, assetId, "photo", ext);
        const publicUrl = await storageService_1.storageService.upload("assets", filePath, file, mimeType);
        const updated = await assetRepository_1.assetRepository.updatePhotoUrl(assetId, publicUrl);
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...updated, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
    async deletePhoto(businessId, assetId) {
        const asset = await this.getById(businessId, assetId);
        if (asset.photoUrl) {
            const path = storageService_1.storageService.extractPath(asset.photoUrl, "assets");
            await storageService_1.storageService.delete("assets", path).catch(() => { });
        }
        const updated = await assetRepository_1.assetRepository.updatePhotoUrl(assetId, null);
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...updated, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
    async uploadManual(businessId, assetId, file, mimeType) {
        const asset = await this.getById(businessId, assetId);
        // Delete old manual if exists
        if (asset.manualUrl) {
            const oldPath = storageService_1.storageService.extractPath(asset.manualUrl, "assets");
            await storageService_1.storageService.delete("assets", oldPath).catch(() => { });
        }
        const filePath = storageService_1.storageService.buildPath(businessId, assetId, "manual", "pdf");
        const publicUrl = await storageService_1.storageService.upload("assets", filePath, file, mimeType);
        const updated = await assetRepository_1.assetRepository.updateManualUrl(assetId, publicUrl);
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...updated, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
    async deleteManual(businessId, assetId) {
        const asset = await this.getById(businessId, assetId);
        if (asset.manualUrl) {
            const path = storageService_1.storageService.extractPath(asset.manualUrl, "assets");
            await storageService_1.storageService.delete("assets", path).catch(() => { });
        }
        const updated = await assetRepository_1.assetRepository.updateManualUrl(assetId, null);
        const totalUsageHours = await sessionRepository_1.sessionRepository.calculateTotalHours(assetId);
        return { ...updated, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
    },
};
