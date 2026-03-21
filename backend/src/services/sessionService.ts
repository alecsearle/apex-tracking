import { assetRepository } from "../repositories/assetRepository";
import { sessionRepository } from "../repositories/sessionRepository";
import { reportRepository } from "../repositories/reportRepository";
import { ConflictError, NotFoundError } from "../utils/errors";

/**
 * Format a session record into the API response shape
 * with enriched join fields (assetName, startedByName, endedByName).
 */
function formatSession(session: {
  id: string;
  assetId: string;
  startedBy: string;
  endedBy: string | null;
  startedAt: Date;
  endedAt: Date | null;
  notes: string | null;
  jobSiteName: string | null;
  totalPausedMs: number | null;
  status: string;
  asset: { id: string; name: string };
  starter: { id: string; fullName: string };
  ender?: { id: string; fullName: string } | null;
}) {
  return {
    id: session.id,
    assetId: session.assetId,
    startedBy: session.startedBy,
    endedBy: session.endedBy,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? undefined,
    notes: session.notes,
    jobSiteName: session.jobSiteName,
    totalPausedMs: session.totalPausedMs,
    status: session.status,
    assetName: session.asset.name,
    startedByName: session.starter.fullName,
    endedByName: session.ender?.fullName ?? undefined,
  };
}

export const sessionService = {
  async startSession(
    businessId: string,
    assetId: string,
    userId: string,
    data?: { notes?: string; jobSiteName?: string }
  ) {
    // Verify asset exists and belongs to business
    const asset = await assetRepository.findById(businessId, assetId);
    if (!asset) throw new NotFoundError("Asset not found");

    if (asset.status !== "available") {
      throw new ConflictError(
        `Asset is currently ${asset.status} and cannot start a new session`
      );
    }

    // Check no active session already
    const activeSession = await sessionRepository.findActiveByAsset(assetId);
    if (activeSession) {
      throw new ConflictError("Asset already has an active session");
    }

    const session = await sessionRepository.create({
      assetId,
      startedBy: userId,
      notes: data?.notes,
      jobSiteName: data?.jobSiteName,
    });

    // Update asset status to in_use
    await assetRepository.updateStatus(assetId, "in_use");

    return formatSession(session);
  },

  async endSession(
    businessId: string,
    sessionId: string,
    userId: string,
    data?: { notes?: string; totalPausedMs?: number }
  ) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new NotFoundError("Session not found");

    // Verify session belongs to this business
    if (session.asset.businessId !== businessId) {
      throw new NotFoundError("Session not found");
    }

    if (session.status !== "active") {
      throw new ConflictError("Session is not active");
    }

    const ended = await sessionRepository.end(sessionId, {
      endedBy: userId,
      notes: data?.notes,
      totalPausedMs: data?.totalPausedMs,
    });

    // Determine new asset status:
    // If there are open high/critical reports → maintenance, otherwise → available
    const hasHighSeverity = await reportRepository.hasOpenHighSeverityReports(
      session.assetId
    );
    const newStatus = hasHighSeverity ? "maintenance" : "available";
    await assetRepository.updateStatus(session.assetId, newStatus);

    return formatSession(ended);
  },

  async getActiveSessions(businessId: string) {
    const sessions = await sessionRepository.findAllActive(businessId);
    return sessions.map((s) => formatSession(s));
  },

  async getAssetSessions(businessId: string, assetId: string) {
    // Verify asset belongs to business
    const asset = await assetRepository.findById(businessId, assetId);
    if (!asset) throw new NotFoundError("Asset not found");

    const sessions = await sessionRepository.findByAsset(businessId, assetId);
    return sessions.map((s) => formatSession(s));
  },
};
