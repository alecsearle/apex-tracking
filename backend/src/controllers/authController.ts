import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { authService } from "../services/authService";
import { membershipRepository } from "../repositories/membershipRepository";
import { businessRepository } from "../repositories/businessRepository";
import { UnauthorizedError } from "../utils/errors";

export const authController = {
  /**
   * POST /api/auth/sync
   * Called by frontend after first login to sync Supabase user into local DB.
   * Auth header is verified but user may not exist in DB yet.
   */
  async syncUser(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing authorization header");
    }

    const token = authHeader.slice(7);
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const user = await authService.syncUser(supabaseUser);
    res.json(user);
  },

  /**
   * GET /api/auth/me
   * Returns the authenticated user's profile and business membership.
   * Used by frontend to bootstrap after login (get businessId, role).
   */
  async getMe(req: Request, res: Response): Promise<void> {
    const user = req.user!;
    const membership = await membershipRepository.findByUserId(user.id);

    let business = null;
    if (membership) {
      business = await businessRepository.findById(membership.businessId);
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
