import express from "express";
import { maintenanceController } from "../controllers/maintenanceController";

const router = express.Router();

// Maintenance Record Routes
// Base path: /api/maintenance
// Get all maintenance records
router.get("/", maintenanceController.getAll);
// Get records for specific asset
router.get("/asset/:assetId", maintenanceController.getByAssetId);
// Get single maintenance record by ID
router.get("/:id", maintenanceController.getById);
// Create new maintenance record
router.post("/", maintenanceController.create);
// Update existing maintenance record
router.put("/:id", maintenanceController.update);
// Delete maintenance record
router.delete("/:id", maintenanceController.delete);

export default router;
