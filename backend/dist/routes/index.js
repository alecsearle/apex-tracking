"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const businessRoutes_1 = __importDefault(require("./businessRoutes"));
const assetRoutes_1 = __importDefault(require("./assetRoutes"));
const sessionRoutes_1 = __importDefault(require("./sessionRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const sopRoutes_1 = __importDefault(require("./sopRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./maintenanceRoutes"));
const sessionController_1 = require("../controllers/sessionController");
const maintenanceController_1 = require("../controllers/maintenanceController");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Health check — no auth required
router.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Auth routes (no authenticate middleware — user may not be in DB yet)
router.use("/auth", authRoutes_1.default);
// Business routes
router.use("/businesses", businessRoutes_1.default);
// Asset routes (nested under business)
router.use("/businesses/:businessId/assets", assetRoutes_1.default);
// Session routes (nested under business)
router.use("/businesses/:businessId/sessions", sessionRoutes_1.default);
// Asset sessions (GET /api/businesses/:businessId/assets/:id/sessions)
router.get("/businesses/:businessId/assets/:id/sessions", authenticate_1.authenticate, authenticate_1.requireMembership, sessionController_1.sessionController.getAssetSessions);
// Report routes (nested under business)
router.use("/businesses/:businessId/reports", reportRoutes_1.default);
// SOP routes (nested under business)
router.use("/businesses/:businessId/sops", sopRoutes_1.default);
// Maintenance routes (nested under business)
router.use("/businesses/:businessId/maintenance", maintenanceRoutes_1.default);
// Per-asset maintenance schedules (GET /api/businesses/:businessId/assets/:assetId/maintenance)
router.get("/businesses/:businessId/assets/:assetId/maintenance", authenticate_1.authenticate, authenticate_1.requireMembership, maintenanceController_1.maintenanceController.getSchedules);
exports.default = router;
