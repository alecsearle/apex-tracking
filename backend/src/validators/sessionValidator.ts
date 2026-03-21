import { z } from "zod/v4";

export const startSessionSchema = z.object({
  assetId: z.uuid(),
  notes: z.string().max(500).trim().optional(),
  jobSiteName: z.string().max(200).trim().optional(),
});

export const endSessionSchema = z.object({
  notes: z.string().max(500).trim().optional(),
  totalPausedMs: z.number().int().min(0).optional(),
});
