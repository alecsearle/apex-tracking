import { prisma } from "../config/prisma";

export const businessRepository = {
  async findById(id: string) {
    return prisma.business.findUnique({ where: { id } });
  },

  async findByCode(code: string) {
    return prisma.business.findUnique({ where: { businessCode: code } });
  },

  async create(data: { name: string; businessCode: string }) {
    return prisma.business.create({ data });
  },

  async update(id: string, data: { name?: string }) {
    return prisma.business.update({ where: { id }, data });
  },

  async findMembers(businessId: string) {
    return prisma.membership.findMany({
      where: { businessId },
      include: { user: true },
      orderBy: { joinedAt: "asc" },
    });
  },

  async removeMember(businessId: string, userId: string) {
    return prisma.membership.delete({
      where: { userId_businessId: { userId, businessId } },
    });
  },
};
