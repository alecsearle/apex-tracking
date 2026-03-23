import { assetRepository } from "../repositories/assetRepository";
import { sopRepository } from "../repositories/sopRepository";
import { NotFoundError } from "../utils/errors";

/**
 * Flatten Prisma SOP relations into the shape the frontend expects:
 * { createdByName, assetName } instead of { creator: { fullName }, asset: { name } }
 */
function formatSop(
  sop: {
    id: string;
    businessId: string;
    assetId: string | null;
    title: string;
    content: string;
    source: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    creator: { id: string; fullName: string };
    asset: { id: string; name: string } | null;
  }
) {
  const { creator, asset, ...rest } = sop;
  return {
    ...rest,
    createdByName: creator.fullName,
    assetName: asset?.name ?? undefined,
  };
}

export const sopService = {
  async getAll(businessId: string, assetId?: string) {
    const sops = await sopRepository.findAll(businessId, assetId);
    return sops.map((sop) => formatSop(sop));
  },

  async getById(businessId: string, sopId: string) {
    const sop = await sopRepository.findById(businessId, sopId);
    if (!sop) throw new NotFoundError("SOP not found");
    return formatSop(sop);
  },

  async create(
    businessId: string,
    data: { title: string; content: string; assetId?: string },
    userId: string
  ) {
    // If assetId provided, verify it belongs to this business
    if (data.assetId) {
      const asset = await assetRepository.findById(businessId, data.assetId);
      if (!asset) throw new NotFoundError("Asset not found");
    }

    const sop = await sopRepository.create({
      businessId,
      assetId: data.assetId,
      title: data.title,
      content: data.content,
      createdBy: userId,
    });
    return formatSop(sop);
  },

  async update(
    businessId: string,
    sopId: string,
    data: { title?: string; content?: string }
  ) {
    const raw = await sopRepository.findById(businessId, sopId);
    if (!raw) throw new NotFoundError("SOP not found");
    const updated = await sopRepository.update(businessId, sopId, data);
    return formatSop(updated);
  },

  async delete(businessId: string, sopId: string) {
    await this.getById(businessId, sopId); // throws if not found
    return sopRepository.delete(businessId, sopId);
  },
};
