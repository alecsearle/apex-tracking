import { Request, Response } from "express";
import { sessionService } from "../services/sessionService";
import { param } from "../utils/params";

export const sessionController = {
  async startSession(req: Request, res: Response): Promise<void> {
    const session = await sessionService.startSession(
      req.membership!.businessId,
      req.body.assetId,
      req.user!.id,
      { notes: req.body.notes, jobSiteName: req.body.jobSiteName }
    );
    res.status(201).json(session);
  },

  async endSession(req: Request, res: Response): Promise<void> {
    const session = await sessionService.endSession(
      req.membership!.businessId,
      param(req.params.sessionId),
      req.user!.id,
      { notes: req.body.notes, totalPausedMs: req.body.totalPausedMs }
    );
    res.json(session);
  },

  async getActiveSessions(req: Request, res: Response): Promise<void> {
    const sessions = await sessionService.getActiveSessions(
      req.membership!.businessId
    );
    res.json(sessions);
  },

  async getAssetSessions(req: Request, res: Response): Promise<void> {
    const sessions = await sessionService.getAssetSessions(
      req.membership!.businessId,
      param(req.params.id)
    );
    res.json(sessions);
  },
};
