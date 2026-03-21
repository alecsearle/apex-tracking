import { prisma } from "../config/prisma";
import { AssetStatus } from "../generated/prisma/client";

export const assetRepository = {
  async findAll(businessId: string) {
    return prisma.asset.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(businessId: string, assetId: string) {
    return prisma.asset.findFirst({
      where: { id: assetId, businessId },
    });
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
    createdBy: string
  ) {
    return prisma.asset.create({
      data: {
        ...data,
        purchaseDate: new Date(data.purchaseDate),
        businessId,
        createdBy,
      },
    });
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
    const updateData: Record<string, unknown> = { ...data };
    if (data.purchaseDate) {
      updateData.purchaseDate = new Date(data.purchaseDate);
    }
    return prisma.asset.update({
      where: { id: assetId, businessId },
      data: updateData,
    });
  },

  async delete(businessId: string, assetId: string) {
    return prisma.asset.delete({
      where: { id: assetId, businessId },
    });
  },

  async updateStatus(assetId: string, status: AssetStatus) {
    return prisma.asset.update({
      where: { id: assetId },
      data: { status },
    });
  },

  async findByNfcTag(businessId: string, nfcTagId: string) {
    return prisma.asset.findFirst({
      where: { businessId, nfcTagId },
    });
  },

  async updatePhotoUrl(assetId: string, photoUrl: string | null) {
    return prisma.asset.update({
      where: { id: assetId },
      data: { photoUrl },
    });
  },

  async updateManualUrl(assetId: string, manualUrl: string | null) {
    return prisma.asset.update({
      where: { id: assetId },
      data: { manualUrl },
    });
  },
};
