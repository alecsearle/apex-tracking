"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.sessionRepository = {
    async findActiveByAsset(assetId) {
        return prisma_1.prisma.usageSession.findFirst({
            where: { assetId, status: "active" },
            include: {
                starter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async findAllActive(businessId) {
        return prisma_1.prisma.usageSession.findMany({
            where: {
                asset: { businessId },
                status: "active",
            },
            include: {
                asset: { select: { id: true, name: true, businessId: true } },
                starter: { select: { id: true, fullName: true } },
            },
            orderBy: { startedAt: "desc" },
        });
    },
    async findByAsset(businessId, assetId) {
        return prisma_1.prisma.usageSession.findMany({
            where: {
                assetId,
                asset: { businessId },
            },
            include: {
                starter: { select: { id: true, fullName: true } },
                ender: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
            orderBy: { startedAt: "desc" },
        });
    },
    async create(data) {
        return prisma_1.prisma.usageSession.create({
            data,
            include: {
                starter: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async end(sessionId, data) {
        return prisma_1.prisma.usageSession.update({
            where: { id: sessionId },
            data: {
                ...data,
                endedAt: new Date(),
                status: "completed",
            },
            include: {
                starter: { select: { id: true, fullName: true } },
                ender: { select: { id: true, fullName: true } },
                asset: { select: { id: true, name: true } },
            },
        });
    },
    async findById(sessionId) {
        return prisma_1.prisma.usageSession.findUnique({
            where: { id: sessionId },
            include: {
                asset: { select: { id: true, name: true, businessId: true } },
                starter: { select: { id: true, fullName: true } },
                ender: { select: { id: true, fullName: true } },
            },
        });
    },
    /**
     * Calculate total usage hours for an asset from completed sessions.
     * Accounts for totalPausedMs if present.
     */
    async calculateTotalHours(assetId) {
        const sessions = await prisma_1.prisma.usageSession.findMany({
            where: { assetId, status: "completed", endedAt: { not: null } },
            select: { startedAt: true, endedAt: true, totalPausedMs: true },
        });
        let totalMs = 0;
        for (const session of sessions) {
            if (session.endedAt) {
                const durationMs = session.endedAt.getTime() - session.startedAt.getTime();
                const pausedMs = session.totalPausedMs || 0;
                totalMs += Math.max(0, durationMs - pausedMs);
            }
        }
        return totalMs / (1000 * 60 * 60); // convert to hours
    },
};
