import { Request, Response, NextFunction } from "express";

/**
 * Mock authentication middleware for tests.
 * Attaches user and membership data directly without JWT verification.
 */
export function mockAuthenticate(userId: string, email: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: userId, email };
    next();
  };
}

export function mockAuthenticateWithMembership(
  userId: string,
  email: string,
  businessId: string,
  role: "owner" | "employee"
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: userId, email };
    req.membership = { businessId, role };
    next();
  };
}
