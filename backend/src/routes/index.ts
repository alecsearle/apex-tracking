import { Router, Request, Response } from "express";
import authRoutes from "./authRoutes";
import businessRoutes from "./businessRoutes";
import assetRoutes from "./assetRoutes";
import sessionRoutes from "./sessionRoutes";
import reportRoutes from "./reportRoutes";
import sopRoutes from "./sopRoutes";
import maintenanceRoutes from "./maintenanceRoutes";
import { sessionController } from "../controllers/sessionController";
import { maintenanceController } from "../controllers/maintenanceController";
import { authenticate, requireMembership } from "../middleware/authenticate";

const router = Router();

// Health check — no auth required
router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth routes (no authenticate middleware — user may not be in DB yet)
router.use("/auth", authRoutes);

// Business routes
router.use("/businesses", businessRoutes);

// Asset routes (nested under business)
router.use("/businesses/:businessId/assets", assetRoutes);

// Session routes (nested under business)
router.use("/businesses/:businessId/sessions", sessionRoutes);

// Asset sessions (GET /api/businesses/:businessId/assets/:id/sessions)
router.get(
  "/businesses/:businessId/assets/:id/sessions",
  authenticate,
  requireMembership,
  sessionController.getAssetSessions
);

// Report routes (nested under business)
router.use("/businesses/:businessId/reports", reportRoutes);

// SOP routes (nested under business)
router.use("/businesses/:businessId/sops", sopRoutes);

// Maintenance routes (nested under business)
router.use("/businesses/:businessId/maintenance", maintenanceRoutes);

// Per-asset maintenance schedules (GET /api/businesses/:businessId/assets/:assetId/maintenance)
router.get(
  "/businesses/:businessId/assets/:assetId/maintenance",
  authenticate,
  requireMembership,
  maintenanceController.getSchedules
);

export default router;
