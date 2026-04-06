"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.membershipRepository = {
    async findByUserId(userId) {
        return prisma_1.prisma.membership.findUnique({ where: { userId } });
    },
    async findByUserAndBusiness(userId, businessId) {
        return prisma_1.prisma.membership.findUnique({
            where: { userId_businessId: { userId, businessId } },
        });
    },
    async create(data) {
        return prisma_1.prisma.membership.create({ data });
    },
    async countByBusiness(businessId) {
        return prisma_1.prisma.membership.count({ where: { businessId } });
    },
};
