"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const supabase_1 = require("../config/supabase");
const authService_1 = require("../services/authService");
const membershipRepository_1 = require("../repositories/membershipRepository");
const businessRepository_1 = require("../repositories/businessRepository");
const errors_1 = require("../utils/errors");
exports.authController = {
    /**
     * POST /api/auth/sync
     * Called by frontend after first login to sync Supabase user into local DB.
     * Auth header is verified but user may not exist in DB yet.
     */
    async syncUser(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new errors_1.UnauthorizedError("Missing authorization header");
        }
        const token = authHeader.slice(7);
        const { data: { user: supabaseUser }, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !supabaseUser) {
            throw new errors_1.UnauthorizedError("Invalid or expired token");
        }
        const user = await authService_1.authService.syncUser(supabaseUser);
        res.json(user);
    },
    /**
     * GET /api/auth/me
     * Returns the authenticated user's profile and business membership.
     * Used by frontend to bootstrap after login (get businessId, role).
     */
    async getMe(req, res) {
        const user = req.user;
        const membership = await membershipRepository_1.membershipRepository.findByUserId(user.id);
        let business = null;
        if (membership) {
            business = await businessRepository_1.businessRepository.findById(membership.businessId);
        }
        res.json({
            user: { id: user.id, email: user.email },
            membership: membership
                ? {
                    businessId: membership.businessId,
                    role: membership.role,
                }
                : null,
            business: business
                ? {
                    id: business.id,
                    name: business.name,
                    businessCode: business.businessCode,
                }
                : null,
        });
    },
};
