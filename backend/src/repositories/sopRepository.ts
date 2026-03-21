import { prisma } from "../config/prisma";

export const sopRepository = {
  async findAll(businessId: string, assetId?: string) {
    const where: Record<string, unknown> = { businessId };
    if (assetId) {
      where.assetId = assetId;
    }

    return prisma.sop.findMany({
      where,
      include: {
        creator: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(businessId: string, sopId: string) {
    return prisma.sop.findFirst({
      where: { id: sopId, businessId },
      include: {
        creator: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async create(data: {
    businessId: string;
    assetId?: string;
    title: string;
    content: string;
    source?: "manual" | "custom";
    createdBy: string;
  }) {
    return prisma.sop.create({
      data: { ...data, source: data.source || "custom" },
      include: {
        creator: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async update(
    businessId: string,
    sopId: string,
    data: { title?: string; content?: string }
  ) {
    return prisma.sop.update({
      where: { id: sopId, businessId },
      data,
      include: {
        creator: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async delete(businessId: string, sopId: string) {
    return prisma.sop.delete({
      where: { id: sopId, businessId },
    });
  },
};
