"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const assetRepository_1 = require("../repositories/assetRepository");
const sessionRepository_1 = require("../repositories/sessionRepository");
const reportRepository_1 = require("../repositories/reportRepository");
const errors_1 = require("../utils/errors");
/**
 * Format a session record into the API response shape
 * with enriched join fields (assetName, startedByName, endedByName).
 */
function formatSession(session) {
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
exports.sessionService = {
    async startSession(businessId, assetId, userId, data) {
        // Verify asset exists and belongs to business
        const asset = await assetRepository_1.assetRepository.findById(businessId, assetId);
        if (!asset)
            throw new errors_1.NotFoundError("Asset not found");
        if (asset.status !== "available") {
            throw new errors_1.ConflictError(`Asset is currently ${asset.status} and cannot start a new session`);
        }
        // Check no active session already
        const activeSession = await sessionRepository_1.sessionRepository.findActiveByAsset(assetId);
        if (activeSession) {
            throw new errors_1.ConflictError("Asset already has an active session");
        }
        const session = await sessionRepository_1.sessionRepository.create({
            assetId,
            startedBy: userId,
            notes: data?.notes,
            jobSiteName: data?.jobSiteName,
        });
        // Update asset status to in_use
        await assetRepository_1.assetRepository.updateStatus(assetId, "in_use");
        return formatSession(session);
    },
    async endSession(businessId, sessionId, userId, data) {
        const session = await sessionRepository_1.sessionRepository.findById(sessionId);
        if (!session)
            throw new errors_1.NotFoundError("Session not found");
        // Verify session belongs to this business
        if (session.asset.businessId !== businessId) {
            throw new errors_1.NotFoundError("Session not found");
        }
        if (session.status !== "active") {
            throw new errors_1.ConflictError("Session is not active");
        }
        const ended = await sessionRepository_1.sessionRepository.end(sessionId, {
            endedBy: userId,
            notes: data?.notes,
            totalPausedMs: data?.totalPausedMs,
        });
        // Determine new asset status:
        // If there are open high/critical reports → maintenance, otherwise → available
        const hasHighSeverity = await reportRepository_1.reportRepository.hasOpenHighSeverityReports(session.assetId);
        const newStatus = hasHighSeverity ? "maintenance" : "available";
        await assetRepository_1.assetRepository.updateStatus(session.assetId, newStatus);
        return formatSession(ended);
    },
    async getActiveSessions(businessId) {
        const sessions = await sessionRepository_1.sessionRepository.findAllActive(businessId);
        return sessions.map((s) => formatSession(s));
    },
    async getAssetSessions(businessId, assetId) {
        // Verify asset belongs to business
        const asset = await assetRepository_1.assetRepository.findById(businessId, assetId);
        if (!asset)
            throw new errors_1.NotFoundError("Asset not found");
        const sessions = await sessionRepository_1.sessionRepository.findByAsset(businessId, assetId);
        return sessions.map((s) => formatSession(s));
    },
};
