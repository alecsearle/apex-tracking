import express from "express";
import { usageController } from "../controllers/usageController";

const router = express.Router();

// Manual entry
router.post("/manual", usageController.createManual);

// Timed sessions
router.post("/start", usageController.startTimed);
router.post("/:id/stop", usageController.stopTimed);

// Get active sessions
router.get("/active", usageController.getAllActive);
router.get("/active/:assetId", usageController.getActiveByAssetId);

//Get usage history
router.get("/asset/:assetId", usageController.getByAssetId);
router.get("/asset/:assetId/total", usageController.getTotalHoursForAsset);
router.get("/:id", usageController.getBySessionId);

// Update or delete
router.put("/:id", usageController.update);
router.delete("/:id", usageController.delete);

export default router;
