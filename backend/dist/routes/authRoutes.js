"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authenticate_1 = require("../middleware/authenticate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// POST /api/auth/sync — no authenticate middleware (user may not be in DB yet)
router.post("/sync", rateLimiter_1.authLimiter, authController_1.authController.syncUser);
// GET /api/auth/me — returns user profile + membership (requires auth)
router.get("/me", authenticate_1.authenticate, authController_1.authController.getMe);
exports.default = router;
