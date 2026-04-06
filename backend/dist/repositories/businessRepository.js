"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.businessRepository = {
    async findById(id) {
        return prisma_1.prisma.business.findUnique({ where: { id } });
    },
    async findByCode(code) {
        return prisma_1.prisma.business.findUnique({ where: { businessCode: code } });
    },
    async create(data) {
        return prisma_1.prisma.business.create({ data });
    },
    async update(id, data) {
        return prisma_1.prisma.business.update({ where: { id }, data });
    },
    async findMembers(businessId) {
        return prisma_1.prisma.membership.findMany({
            where: { businessId },
            include: { user: true },
            orderBy: { joinedAt: "asc" },
        });
    },
    async removeMember(businessId, userId) {
        return prisma_1.prisma.membership.delete({
            where: { userId_businessId: { userId, businessId } },
        });
    },
};
