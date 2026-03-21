import { prisma } from "../config/prisma";
import { MemberRole } from "../generated/prisma/client";

export const membershipRepository = {
  async findByUserId(userId: string) {
    return prisma.membership.findUnique({ where: { userId } });
  },

  async findByUserAndBusiness(userId: string, businessId: string) {
    return prisma.membership.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });
  },

  async create(data: { userId: string; businessId: string; role: MemberRole }) {
    return prisma.membership.create({ data });
  },

  async countByBusiness(businessId: string) {
    return prisma.membership.count({ where: { businessId } });
  },
};
