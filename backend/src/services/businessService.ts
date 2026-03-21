import { prisma } from "../config/prisma";
import { businessRepository } from "../repositories/businessRepository";
import { membershipRepository } from "../repositories/membershipRepository";
import { generateBusinessCode } from "../utils/businessCode";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

export const businessService = {
  async createBusiness(userId: string, name: string) {
    // Check user doesn't already have a business (MVP: one per user)
    const existing = await membershipRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictError("User already belongs to a business");
    }

    // Generate unique business code with retry on collision
    let businessCode: string;
    let attempts = 0;
    do {
      businessCode = generateBusinessCode();
      const exists = await businessRepository.findByCode(businessCode);
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new ConflictError("Could not generate unique business code");
    }

    // Transaction: create business + owner membership
    return prisma.$transaction(async (tx) => {
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

  async getBusiness(businessId: string) {
    const business = await businessRepository.findById(businessId);
    if (!business) throw new NotFoundError("Business not found");
    return business;
  },

  async updateBusiness(businessId: string, data: { name?: string }) {
    return businessRepository.update(businessId, data);
  },

  async getMembers(businessId: string) {
    return businessRepository.findMembers(businessId);
  },

  async removeMember(
    businessId: string,
    targetUserId: string,
    requestingUserId: string
  ) {
    const targetMembership = await membershipRepository.findByUserAndBusiness(
      targetUserId,
      businessId
    );
    if (!targetMembership) throw new NotFoundError("Member not found");
    if (targetMembership.role === "owner") {
      throw new ForbiddenError("Cannot remove the business owner");
    }
    if (targetUserId === requestingUserId) {
      throw new ForbiddenError("Cannot remove yourself");
    }

    return businessRepository.removeMember(businessId, targetUserId);
  },

  async joinBusiness(userId: string, businessCode: string) {
    // Check user doesn't already have a business
    const existing = await membershipRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictError("User already belongs to a business");
    }

    const business = await businessRepository.findByCode(businessCode);
    if (!business) throw new NotFoundError("Business not found");

    const membership = await membershipRepository.create({
      userId,
      businessId: business.id,
      role: "employee",
    });

    return { business, membership };
  },
};
