import { prisma } from "../config/prisma";

export const sessionRepository = {
  async findActiveByAsset(assetId: string) {
    return prisma.usageSession.findFirst({
      where: { assetId, status: "active" },
      include: {
        starter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async findAllActive(businessId: string) {
    return prisma.usageSession.findMany({
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

  async findByAsset(businessId: string, assetId: string) {
    return prisma.usageSession.findMany({
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

  async create(data: {
    assetId: string;
    startedBy: string;
    notes?: string;
    jobSiteName?: string;
  }) {
    return prisma.usageSession.create({
      data,
      include: {
        starter: { select: { id: true, fullName: true } },
        asset: { select: { id: true, name: true } },
      },
    });
  },

  async end(
    sessionId: string,
    data: { endedBy: string; notes?: string; totalPausedMs?: number }
  ) {
    return prisma.usageSession.update({
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

  async findById(sessionId: string) {
    return prisma.usageSession.findUnique({
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
  async calculateTotalHours(assetId: string): Promise<number> {
    const sessions = await prisma.usageSession.findMany({
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
