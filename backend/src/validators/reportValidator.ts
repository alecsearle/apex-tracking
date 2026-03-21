import { z } from "zod/v4";

export const createReportSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().min(1).max(2000).trim(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  assetId: z.uuid(),
  sessionId: z.uuid().optional(),
});

export const updateReportSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().min(1).max(2000).trim().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
});
