"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionController_1 = require("../controllers/sessionController");
const authenticate_1 = require("../middleware/authenticate");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const sessionValidator_1 = require("../validators/sessionValidator");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication + business membership
router.use(authenticate_1.authenticate, authenticate_1.requireMembership);
// POST /api/businesses/:businessId/sessions — start a session
router.post("/", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(sessionValidator_1.startSessionSchema), sessionController_1.sessionController.startSession);
// PUT /api/businesses/:businessId/sessions/:sessionId/end — end a session
router.put("/:sessionId/end", rateLimiter_1.generalLimiter, (0, validateRequest_1.validateRequest)(sessionValidator_1.endSessionSchema), sessionController_1.sessionController.endSession);
// GET /api/businesses/:businessId/sessions/active — all active sessions
router.get("/active", sessionController_1.sessionController.getActiveSessions);
exports.default = router;
