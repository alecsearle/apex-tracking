import { assetRepository } from "../repositories/assetRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { storageService } from "./storageService";
import { NotFoundError } from "../utils/errors";

export const assetService = {
  async getAll(businessId: string) {
    const assets = await assetRepository.findAll(businessId);

    // Compute totalUsageHours for each asset
    const enriched = await Promise.all(
      assets.map(async (asset) => {
        const totalUsageHours = await sessionRepository.calculateTotalHours(asset.id);
        return { ...asset, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
      })
    );

    return enriched;
  },

  async getById(businessId: string, assetId: string) {
    const asset = await assetRepository.findById(businessId, assetId);
    if (!asset) throw new NotFoundError("Asset not found");

    const totalUsageHours = await sessionRepository.calculateTotalHours(assetId);
    return { ...asset, totalUsageHours: Math.round(totalUsageHours * 100) / 100 };
  },

  async create(
    businessId: string,
    data: {
      name: string;
      brand: string;
      model: string;
      serialNumber: string;
      purchaseDate: string;
      nfcTagId?: string;
    },
    userId: string
  ) {
    const asset = await assetRepository.create(businessId, data, userId);
    return { ...asset, totalUsageHours: 0 };
  },

  async update(
    businessId: string,
    assetId: string,
    data: {
      name?: string;
      brand?: string;
      model?: string;
      serialNumber?: string;
      purchaseDate?: string;
      nfcTagId?: string;
    }
  ) {
    await this.getById(businessId, assetId); // throws if not found
    return assetRepository.update(businessId, assetId, data);
  },

  async delete(businessId: string, assetId: string) {
    const asset = await this.getById(businessId, assetId);

    // Delete files from Supabase Storage if present
    if (asset.photoUrl) {
      const path = storageService.extractPath(asset.photoUrl, "assets");
      await storageService.delete("assets", path).catch(() => {});
    }
    if (asset.manualUrl) {
      const path = storageService.extractPath(asset.manualUrl, "assets");
      await storageService.delete("assets", path).catch(() => {});
    }

    return assetRepository.delete(businessId, assetId);
  },

  async uploadPhoto(
    businessId: string,
    assetId: string,
    file: Buffer,
    mimeType: string
  ) {
    const asset = await this.getById(businessId, assetId);

    // Delete old photo if exists
    if (asset.photoUrl) {
      const oldPath = storageService.extractPath(asset.photoUrl, "assets");
      await storageService.delete("assets", oldPath).catch(() => {});
    }

    const ext = mimeType.split("/")[1] || "jpg";
    const filePath = storageService.buildPath(businessId, assetId, "photo", ext);
    const publicUrl = await storageService.upload("assets", filePath, file, mimeType);

    return assetRepository.updatePhotoUrl(assetId, publicUrl);
  },

  async deletePhoto(businessId: string, assetId: string) {
    const asset = await this.getById(businessId, assetId);
    if (asset.photoUrl) {
      const path = storageService.extractPath(asset.photoUrl, "assets");
      await storageService.delete("assets", path).catch(() => {});
    }
    return assetRepository.updatePhotoUrl(assetId, null);
  },

  async uploadManual(
    businessId: string,
    assetId: string,
    file: Buffer,
    mimeType: string
  ) {
    const asset = await this.getById(businessId, assetId);

    // Delete old manual if exists
    if (asset.manualUrl) {
      const oldPath = storageService.extractPath(asset.manualUrl, "assets");
      await storageService.delete("assets", oldPath).catch(() => {});
    }

    const filePath = storageService.buildPath(businessId, assetId, "manual", "pdf");
    const publicUrl = await storageService.upload("assets", filePath, file, mimeType);

    return assetRepository.updateManualUrl(assetId, publicUrl);
  },

  async deleteManual(businessId: string, assetId: string) {
    const asset = await this.getById(businessId, assetId);
    if (asset.manualUrl) {
      const path = storageService.extractPath(asset.manualUrl, "assets");
      await storageService.delete("assets", path).catch(() => {});
    }
    return assetRepository.updateManualUrl(assetId, null);
  },
};
