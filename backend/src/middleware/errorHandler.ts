import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import pino from "pino";

const logger = pino({ name: "error-handler" });

/**
 * Global error handler — must be registered last in Express middleware chain.
 * Returns consistent JSON error responses per ARCHITECTURE.md.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      statusCode: err.statusCode,
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as { code?: string }).code === "P2002") {
    const target = (err as { meta?: { target?: string[] } }).meta?.target;
    const field = target?.[0] ?? "unknown";
    logger.warn({ target }, "Prisma P2002 unique constraint violation");
    res.status(409).json({
      error: `Duplicate entry`,
      field,
      code: "CONFLICT",
      statusCode: 409,
    });
    return;
  }

  // Prisma record not found
  if ((err as { code?: string }).code === "P2025") {
    res.status(404).json({
      error: "Record not found",
      code: "NOT_FOUND",
      statusCode: 404,
    });
    return;
  }

  // Unexpected errors
  logger.error(err, "Unhandled error");
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    statusCode: 500,
  });
}
