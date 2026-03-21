import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { authorize } from "../../src/middleware/authorize";
import { requireMembership } from "../../src/middleware/authenticate";
import { validateRequest } from "../../src/middleware/validateRequest";
import { errorHandler } from "../../src/middleware/errorHandler";
import { NotFoundError } from "../../src/utils/errors";
import { generalLimiter, uploadLimiter } from "../../src/middleware/rateLimiter";
import { uploadImage, uploadPdf } from "../../src/middleware/multerConfig";

// Controllers
import { businessController } from "../../src/controllers/businessController";
import { assetController } from "../../src/controllers/assetController";
import { sessionController } from "../../src/controllers/sessionController";
import { reportController } from "../../src/controllers/reportController";
import { sopController } from "../../src/controllers/sopController";
import { maintenanceController } from "../../src/controllers/maintenanceController";

// Validators
import { createBusinessSchema, updateBusinessSchema, joinBusinessSchema } from "../../src/validators/businessValidator";
import { createAssetSchema, updateAssetSchema } from "../../src/validators/assetValidator";
import { startSessionSchema, endSessionSchema } from "../../src/validators/sessionValidator";
import { createReportSchema, updateReportSchema } from "../../src/validators/reportValidator";
import { createSopSchema, updateSopSchema } from "../../src/validators/sopValidator";
import { createScheduleSchema, updateScheduleSchema, completeScheduleSchema } from "../../src/validators/maintenanceValidator";

/**
 * Create a test app with mock auth injected before routes.
 * Bypasses Supabase JWT verification entirely.
 */
export function createAuthenticatedTestApp(auth: {
  userId: string;
  email: string;
  businessId: string;
  role: "owner" | "employee";
}) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  // Inject mock auth on every request
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: auth.userId, email: auth.email };
    req.membership = { businessId: auth.businessId, role: auth.role };
    next();
  });

  // Health
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // ── Business routes ──
  app.post("/api/businesses", generalLimiter, validateRequest(createBusinessSchema), businessController.createBusiness);
  app.post("/api/businesses/join", generalLimiter, validateRequest(joinBusinessSchema), businessController.joinBusiness);
  app.get("/api/businesses/:businessId", requireMembership, businessController.getBusiness);
  app.put("/api/businesses/:businessId", generalLimiter, requireMembership, authorize("owner"), validateRequest(updateBusinessSchema), businessController.updateBusiness);
  app.get("/api/businesses/:businessId/members", requireMembership, businessController.getMembers);
  app.delete("/api/businesses/:businessId/members/:userId", generalLimiter, requireMembership, authorize("owner"), businessController.removeMember);

  // ── Asset routes ──
  app.get("/api/businesses/:businessId/assets", requireMembership, assetController.getAll);
  app.post("/api/businesses/:businessId/assets", generalLimiter, requireMembership, validateRequest(createAssetSchema), assetController.create);
  app.get("/api/businesses/:businessId/assets/:id", requireMembership, assetController.getById);
  app.put("/api/businesses/:businessId/assets/:id", generalLimiter, requireMembership, authorize("owner"), validateRequest(updateAssetSchema), assetController.update);
  app.delete("/api/businesses/:businessId/assets/:id", generalLimiter, requireMembership, authorize("owner"), assetController.delete);
  app.post("/api/businesses/:businessId/assets/:id/photo", uploadLimiter, requireMembership, authorize("owner"), uploadImage, assetController.uploadPhoto);
  app.delete("/api/businesses/:businessId/assets/:id/photo", generalLimiter, requireMembership, authorize("owner"), assetController.deletePhoto);
  app.post("/api/businesses/:businessId/assets/:id/manual", uploadLimiter, requireMembership, authorize("owner"), uploadPdf, assetController.uploadManual);
  app.delete("/api/businesses/:businessId/assets/:id/manual", generalLimiter, requireMembership, authorize("owner"), assetController.deleteManual);

  // ── Session routes ──
  app.post("/api/businesses/:businessId/sessions", generalLimiter, requireMembership, validateRequest(startSessionSchema), sessionController.startSession);
  app.put("/api/businesses/:businessId/sessions/:sessionId/end", generalLimiter, requireMembership, validateRequest(endSessionSchema), sessionController.endSession);
  app.get("/api/businesses/:businessId/sessions/active", requireMembership, sessionController.getActiveSessions);
  app.get("/api/businesses/:businessId/assets/:id/sessions", requireMembership, sessionController.getAssetSessions);

  // ── Report routes ──
  app.post("/api/businesses/:businessId/reports", generalLimiter, requireMembership, validateRequest(createReportSchema), reportController.create);
  app.get("/api/businesses/:businessId/reports", requireMembership, reportController.getAll);
  app.get("/api/businesses/:businessId/reports/:id", requireMembership, reportController.getById);
  app.put("/api/businesses/:businessId/reports/:id", generalLimiter, requireMembership, validateRequest(updateReportSchema), reportController.update);
  app.post("/api/businesses/:businessId/reports/:id/photos", uploadLimiter, requireMembership, uploadImage, reportController.addPhoto);
  app.delete("/api/businesses/:businessId/reports/:id/photos/:photoId", generalLimiter, requireMembership, reportController.deletePhoto);

  // ── SOP routes ──
  app.get("/api/businesses/:businessId/sops", requireMembership, sopController.getAll);
  app.post("/api/businesses/:businessId/sops", generalLimiter, requireMembership, validateRequest(createSopSchema), sopController.create);
  app.get("/api/businesses/:businessId/sops/:id", requireMembership, sopController.getById);
  app.put("/api/businesses/:businessId/sops/:id", generalLimiter, requireMembership, validateRequest(updateSopSchema), sopController.update);
  app.delete("/api/businesses/:businessId/sops/:id", generalLimiter, requireMembership, authorize("owner"), sopController.delete);

  // ── Maintenance routes ──
  app.get("/api/businesses/:businessId/maintenance/schedules", requireMembership, maintenanceController.getSchedules);
  app.post("/api/businesses/:businessId/maintenance/schedules", generalLimiter, requireMembership, authorize("owner"), validateRequest(createScheduleSchema), maintenanceController.createSchedule);
  app.get("/api/businesses/:businessId/maintenance/schedules/:id", requireMembership, maintenanceController.getScheduleById);
  app.put("/api/businesses/:businessId/maintenance/schedules/:id", generalLimiter, requireMembership, authorize("owner"), validateRequest(updateScheduleSchema), maintenanceController.updateSchedule);
  app.delete("/api/businesses/:businessId/maintenance/schedules/:id", generalLimiter, requireMembership, authorize("owner"), maintenanceController.deleteSchedule);
  app.get("/api/businesses/:businessId/maintenance/due", requireMembership, maintenanceController.getDueSchedules);
  app.post("/api/businesses/:businessId/maintenance/schedules/:id/complete", generalLimiter, requireMembership, validateRequest(completeScheduleSchema), maintenanceController.completeSchedule);
  app.get("/api/businesses/:businessId/maintenance/schedules/:id/logs", requireMembership, maintenanceController.getLogs);
  app.get("/api/businesses/:businessId/assets/:assetId/maintenance", requireMembership, maintenanceController.getSchedules);

  // 404
  app.use((_req: Request, _res: Response) => {
    throw new NotFoundError("Route not found");
  });

  app.use(errorHandler);
  return app;
}
