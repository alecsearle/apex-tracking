import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors";

type Role = "owner" | "employee";

/**
 * Role-based authorization middleware factory.
 * Must be used after authenticate + requireMembership.
 */
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.membership) {
      throw new ForbiddenError("No business membership found");
    }
    if (!roles.includes(req.membership.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }
    next();
  };
}
