import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { userRepository } from "../repositories/userRepository";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

/**
 * Authentication middleware — verifies Supabase JWT, loads user + membership.
 * Excluded from /api/auth/sync and /api/health.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }

  const token = authHeader.slice(7);

  // Verify JWT with Supabase
  const {
    data: { user: supabaseUser },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !supabaseUser) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  // Find user in DB — only upsert if not found (saves a DB round-trip on every request)
  let user = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
    include: { memberships: { take: 1 } },
  });

  if (!user) {
    // First request for this user — sync from Supabase auth.
    // Handles re-registration (same email, new auth ID).
    const synced = await userRepository.upsert({
      id: supabaseUser.id,
      email: supabaseUser.email!,
      fullName:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        "User",
    });
    // Re-fetch with membership included
    user = await prisma.user.findUniqueOrThrow({
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
export async function requireMembership(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.membership) {
    throw new ForbiddenError("No business membership found");
  }
  next();
}
