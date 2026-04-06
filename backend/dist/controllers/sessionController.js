"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionController = void 0;
const sessionService_1 = require("../services/sessionService");
const params_1 = require("../utils/params");
exports.sessionController = {
    async startSession(req, res) {
        const session = await sessionService_1.sessionService.startSession(req.membership.businessId, req.body.assetId, req.user.id, { notes: req.body.notes, jobSiteName: req.body.jobSiteName });
        res.status(201).json(session);
    },
    async endSession(req, res) {
        const session = await sessionService_1.sessionService.endSession(req.membership.businessId, (0, params_1.param)(req.params.sessionId), req.user.id, { notes: req.body.notes, totalPausedMs: req.body.totalPausedMs });
        res.json(session);
    },
    async getActiveSessions(req, res) {
        const sessions = await sessionService_1.sessionService.getActiveSessions(req.membership.businessId);
        res.json(sessions);
    },
    async getAssetSessions(req, res) {
        const sessions = await sessionService_1.sessionService.getAssetSessions(req.membership.businessId, (0, params_1.param)(req.params.id));
        res.json(sessions);
    },
};
