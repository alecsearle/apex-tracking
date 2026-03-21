import { z } from "zod/v4";

export const createScheduleSchema = z
  .object({
    title: z.string().min(1).max(200).trim(),
    description: z.string().max(1000).trim().optional(),
    assetId: z.uuid(),
    triggerType: z.enum(["usage_hours", "time_interval"]),
    intervalHours: z.number().min(1).max(10000).optional(),
    intervalDays: z.number().int().min(1).max(3650).optional(),
  })
  .refine(
    (data) => data.triggerType !== "usage_hours" || data.intervalHours !== undefined,
    { message: "intervalHours is required for usage_hours trigger type", path: ["intervalHours"] }
  )
  .refine(
    (data) => data.triggerType !== "time_interval" || data.intervalDays !== undefined,
    { message: "intervalDays is required for time_interval trigger type", path: ["intervalDays"] }
  );

export const updateScheduleSchema = z
  .object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(1000).trim().optional(),
    triggerType: z.enum(["usage_hours", "time_interval"]).optional(),
    intervalHours: z.number().min(1).max(10000).optional(),
    intervalDays: z.number().int().min(1).max(3650).optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => data.triggerType !== "usage_hours" || data.intervalHours !== undefined,
    { message: "intervalHours is required for usage_hours trigger type", path: ["intervalHours"] }
  )
  .refine(
    (data) => data.triggerType !== "time_interval" || data.intervalDays !== undefined,
    { message: "intervalDays is required for time_interval trigger type", path: ["intervalDays"] }
  );

export const completeScheduleSchema = z.object({
  notes: z.string().max(1000).trim().optional(),
  usageHoursAtCompletion: z.number().min(0).optional(),
});
