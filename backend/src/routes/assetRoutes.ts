import express from "express";
import { assetController } from "../controllers/assetController";
import { uploadManual } from "../middleware/upload";

const router = express.Router();

// Base path: /api/assets
// Get all assets
router.get("/", assetController.getAll);
// Get single asset by ID
router.get("/:id", assetController.getById);
// Create new asset
router.post("/", assetController.create);
// Update existing asset
router.put("/:id", assetController.update);
// Delete asset
router.delete("/:id", assetController.delete);

// Manual Routes
// Upload manual for asset
router.post("/:id/manual", uploadManual.single("manual"), assetController.uploadManual);
// Get manual file for asset
router.get("/:id/manual", assetController.getManual);
// Delete manual file for asset
router.delete("/:id/manual", assetController.deleteManual);

export default router;
