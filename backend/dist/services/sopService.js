"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sopService = void 0;
const assetRepository_1 = require("../repositories/assetRepository");
const sopRepository_1 = require("../repositories/sopRepository");
const errors_1 = require("../utils/errors");
/**
 * Flatten Prisma SOP relations into the shape the frontend expects:
 * { createdByName, assetName } instead of { creator: { fullName }, asset: { name } }
 */
function formatSop(sop) {
    const { creator, asset, ...rest } = sop;
    return {
        ...rest,
        createdByName: creator.fullName,
        assetName: asset?.name ?? undefined,
    };
}
exports.sopService = {
    async getAll(businessId, assetId) {
        const sops = await sopRepository_1.sopRepository.findAll(businessId, assetId);
        return sops.map((sop) => formatSop(sop));
    },
    async getById(businessId, sopId) {
        const sop = await sopRepository_1.sopRepository.findById(businessId, sopId);
        if (!sop)
            throw new errors_1.NotFoundError("SOP not found");
        return formatSop(sop);
    },
    async create(businessId, data, userId) {
        // If assetId provided, verify it belongs to this business
        if (data.assetId) {
            const asset = await assetRepository_1.assetRepository.findById(businessId, data.assetId);
            if (!asset)
                throw new errors_1.NotFoundError("Asset not found");
        }
        const sop = await sopRepository_1.sopRepository.create({
            businessId,
            assetId: data.assetId,
            title: data.title,
            content: data.content,
            createdBy: userId,
        });
        return formatSop(sop);
    },
    async update(businessId, sopId, data) {
        const raw = await sopRepository_1.sopRepository.findById(businessId, sopId);
        if (!raw)
            throw new errors_1.NotFoundError("SOP not found");
        const updated = await sopRepository_1.sopRepository.update(businessId, sopId, data);
        return formatSop(updated);
    },
    async delete(businessId, sopId) {
        await this.getById(businessId, sopId); // throws if not found
        return sopRepository_1.sopRepository.delete(businessId, sopId);
    },
};
