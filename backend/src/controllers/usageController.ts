import { Request, Response } from "express";
import { usageService } from "../services/usageService";
import { assetService } from "../services/assetService";

export const usageController = {
  createManual: async (req: Request, res: Response) => {
    try {
      const data = req.body;

      if (!data.assetId || !data.startTime || !data.duration) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["assetId", "startTime", "duration"],
        });
      }

      const asset = await assetService.getById(data.assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const session = await usageService.createManualSession(data);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating manual usage:", error);
      res.status(500).json({ error: "Failed to create manual usage entry" });
    }
  },

  startTimed: async (req: Request, res: Response) => {
    try {
      const data = req.body;

      if (!data.assetId) {
        return res.status(400).json({
          error: "Missing required field",
        });
      }

      const asset = await assetService.getById(data.assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const session = await usageService.startTimedSession(data);
      res.status(201).json(session);
    } catch (error: any) {
      if (error.message === "Asset already has an active session") {
        return res.status(409).json({ error: error.message });
      }
      console.error("Error starting timed session:", error);
      res.status(500).json({ error: "Failed to start timed session" });
    }
  },

  stopTimed: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const session = await usageService.stopTimedSession(id, data);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error: any) {
      if (error.messaage === "Session is not active") {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error stopping timed session:", error);
      res.status(500).json({ error: "Failed to stop timed session" });
    }
  },

  getAllActive: async (req: Request, res: Response) => {
    try {
      const sessions = await usageService.getAllActiveSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      res.status(500).json({ error: "Failed to fetch active sessions" });
    }
  },

  getActiveByAssetId: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.assetId as string;
      const session = await usageService.getActiveSessionByAssetId(assetId);

      if (!session) {
        return res.status(404).json({ error: "No active session for this asset" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching active session for asset:", error);
      res.status(500).json({ error: "Failed to fetch active session for asset" });
    }
  },

  getByAssetId: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.assetId as string;
      const sessions = await usageService.getSessionsByAssetId(assetId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions for asset:", error);
      res.status(500).json({ error: "Failed to fetch sessions for asset" });
    }
  },

  getBySessionId: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const session = await usageService.getSessionById(id);

      if (!session) {
        return res.status(404).json({
          error: "Session not found",
        });
      }

      res.json(session);
    } catch (error) {
      console.error("Error fetching session by ID:", error);
      res.status(500).json({ error: "Failed to fetch session by ID" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No updates provided" });
      }

      const session = await usageService.updateSession(id, updates);

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const deleted = await usageService.deleteSession(id);

      if (!deleted) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting usage session:", error);
      res.status(500).json({ error: "Failed to delete usage session" });
    }
  },

  getTotalHoursForAsset: async (req: Request, res: Response) => {
    try {
      const assetId = req.params.assetId as string;

      const asset = await assetService.getById(assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }

      const totalHours = await usageService.getTotalHoursForAsset(assetId);
      res.json({ assetId, totalHours });
    } catch (error) {
      console.error("Error calculating total hours for asset:", error);
      res.status(500).json({ error: "Failed to calculate total hours for asset" });
    }
  },
};
