"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessService = void 0;
const prisma_1 = require("../config/prisma");
const businessRepository_1 = require("../repositories/businessRepository");
const membershipRepository_1 = require("../repositories/membershipRepository");
const businessCode_1 = require("../utils/businessCode");
const errors_1 = require("../utils/errors");
exports.businessService = {
    async createBusiness(userId, name) {
        // Check user doesn't already have a business (MVP: one per user)
        const existing = await membershipRepository_1.membershipRepository.findByUserId(userId);
        if (existing) {
            throw new errors_1.ConflictError("User already belongs to a business");
        }
        // Generate unique business code with retry on collision
        let businessCode;
        let attempts = 0;
        do {
            businessCode = (0, businessCode_1.generateBusinessCode)();
            const exists = await businessRepository_1.businessRepository.findByCode(businessCode);
            if (!exists)
                break;
            attempts++;
        } while (attempts < 10);
        if (attempts >= 10) {
            throw new errors_1.ConflictError("Could not generate unique business code");
        }
        // Transaction: create business + owner membership
        return prisma_1.prisma.$transaction(async (tx) => {
            const business = await tx.business.create({
                data: { name, businessCode },
            });
            const membership = await tx.membership.create({
                data: {
                    userId,
                    businessId: business.id,
                    role: "owner",
                },
            });
            return { business, membership };
        });
    },
    async getBusiness(businessId) {
        const business = await businessRepository_1.businessRepository.findById(businessId);
        if (!business)
            throw new errors_1.NotFoundError("Business not found");
        return business;
    },
    async updateBusiness(businessId, data) {
        return businessRepository_1.businessRepository.update(businessId, data);
    },
    async getMembers(businessId) {
        return businessRepository_1.businessRepository.findMembers(businessId);
    },
    async removeMember(businessId, targetUserId, requestingUserId) {
        const targetMembership = await membershipRepository_1.membershipRepository.findByUserAndBusiness(targetUserId, businessId);
        if (!targetMembership)
            throw new errors_1.NotFoundError("Member not found");
        if (targetMembership.role === "owner") {
            throw new errors_1.ForbiddenError("Cannot remove the business owner");
        }
        if (targetUserId === requestingUserId) {
            throw new errors_1.ForbiddenError("Cannot remove yourself");
        }
        return businessRepository_1.businessRepository.removeMember(businessId, targetUserId);
    },
    async joinBusiness(userId, businessCode) {
        // Check user doesn't already have a business
        const existing = await membershipRepository_1.membershipRepository.findByUserId(userId);
        if (existing) {
            throw new errors_1.ConflictError("User already belongs to a business");
        }
        const business = await businessRepository_1.businessRepository.findByCode(businessCode);
        if (!business)
            throw new errors_1.NotFoundError("Business not found");
        const membership = await membershipRepository_1.membershipRepository.create({
            userId,
            businessId: business.id,
            role: "employee",
        });
        return { business, membership };
    },
};
