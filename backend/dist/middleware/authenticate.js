"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireMembership = requireMembership;
const supabase_1 = require("../config/supabase");
const prisma_1 = require("../config/prisma");
const userRepository_1 = require("../repositories/userRepository");
const errors_1 = require("../utils/errors");
/**
 * Authentication middleware — verifies Supabase JWT, loads user + membership.
 * Excluded from /api/auth/sync and /api/health.
 */
async function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new errors_1.UnauthorizedError("Missing or invalid authorization header");
    }
    const token = authHeader.slice(7);
    // Verify JWT with Supabase
    const { data: { user: supabaseUser }, error, } = await supabase_1.supabaseAdmin.auth.getUser(token);
    if (error || !supabaseUser) {
        throw new errors_1.UnauthorizedError("Invalid or expired token");
    }
    // Find user in DB — only upsert if not found (saves a DB round-trip on every request)
    let user = await prisma_1.prisma.user.findUnique({
        where: { id: supabaseUser.id },
        include: { memberships: { take: 1 } },
    });
    if (!user) {
        // First request for this user — sync from Supabase auth.
        // Handles re-registration (same email, new auth ID).
        const synced = await userRepository_1.userRepository.upsert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            fullName: supabaseUser.user_metadata?.full_name ||
                supabaseUser.email?.split("@")[0] ||
                "User",
        });
        // Re-fetch with membership included
        user = await prisma_1.prisma.user.findUniqueOrThrow({
            where: { id: synced.id },
            include: { memberships: { take: 1 } },
        });
    }
    const membership = user.memberships[0] ?? null;
    // Attach user to request — membership may be null (onboarding)
    req.user = { id: user.id, email: user.email };
    if (membership) {
        req.membership = {
            businessId: membership.businessId,
            role: membership.role,
        };
    }
    next();
}
/**
 * Middleware that requires a business membership.
 * Use after authenticate() on routes that need business context.
 */
async function requireMembership(req, _res, next) {
    if (!req.membership) {
        throw new errors_1.ForbiddenError("No business membership found");
    }
    next();
}
