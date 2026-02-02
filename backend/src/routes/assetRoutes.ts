import express from "express";
import { assetController } from "../controllers/assetController";

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

export default router;
