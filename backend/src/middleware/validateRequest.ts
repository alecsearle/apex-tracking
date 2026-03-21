import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import { ValidationError } from "../utils/errors";

/**
 * Request validation middleware factory.
 * Parses and replaces req[source] with Zod-validated data.
 */
export function validateRequest(
  schema: z.ZodType,
  source: "body" | "params" | "query" = "body"
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      throw new ValidationError(
        `Validation failed: ${details.map((d) => d.message).join(", ")}`
      );
    }
    // Replace with parsed/stripped data
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}
