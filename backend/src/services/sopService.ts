import { assetRepository } from "../repositories/assetRepository";
import { sopRepository } from "../repositories/sopRepository";
import { NotFoundError } from "../utils/errors";

export const sopService = {
  async getAll(businessId: string, assetId?: string) {
    return sopRepository.findAll(businessId, assetId);
  },

  async getById(businessId: string, sopId: string) {
    const sop = await sopRepository.findById(businessId, sopId);
    if (!sop) throw new NotFoundError("SOP not found");
    return sop;
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

    return sopRepository.create({
      businessId,
      assetId: data.assetId,
      title: data.title,
      content: data.content,
      createdBy: userId,
    });
  },

  async update(
    businessId: string,
    sopId: string,
    data: { title?: string; content?: string }
  ) {
    await this.getById(businessId, sopId); // throws if not found
    return sopRepository.update(businessId, sopId, data);
  },

  async delete(businessId: string, sopId: string) {
    await this.getById(businessId, sopId); // throws if not found
    return sopRepository.delete(businessId, sopId);
  },
};
