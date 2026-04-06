"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeScheduleSchema = exports.updateScheduleSchema = exports.createScheduleSchema = void 0;
const v4_1 = require("zod/v4");
exports.createScheduleSchema = v4_1.z
    .object({
    title: v4_1.z.string().min(1).max(200).trim(),
    description: v4_1.z.string().max(1000).trim().optional(),
    assetId: v4_1.z.uuid(),
    triggerType: v4_1.z.enum(["usage_hours", "time_interval"]),
    intervalHours: v4_1.z.number().min(1).max(10000).optional(),
    intervalDays: v4_1.z.number().int().min(1).max(3650).optional(),
})
    .refine((data) => data.triggerType !== "usage_hours" || data.intervalHours !== undefined, { message: "intervalHours is required for usage_hours trigger type", path: ["intervalHours"] })
    .refine((data) => data.triggerType !== "time_interval" || data.intervalDays !== undefined, { message: "intervalDays is required for time_interval trigger type", path: ["intervalDays"] });
exports.updateScheduleSchema = v4_1.z
    .object({
    title: v4_1.z.string().min(1).max(200).trim().optional(),
    description: v4_1.z.string().max(1000).trim().optional(),
    triggerType: v4_1.z.enum(["usage_hours", "time_interval"]).optional(),
    intervalHours: v4_1.z.number().min(1).max(10000).optional(),
    intervalDays: v4_1.z.number().int().min(1).max(3650).optional(),
    active: v4_1.z.boolean().optional(),
})
    .refine((data) => data.triggerType !== "usage_hours" || data.intervalHours !== undefined, { message: "intervalHours is required for usage_hours trigger type", path: ["intervalHours"] })
    .refine((data) => data.triggerType !== "time_interval" || data.intervalDays !== undefined, { message: "intervalDays is required for time_interval trigger type", path: ["intervalDays"] });
exports.completeScheduleSchema = v4_1.z.object({
    notes: v4_1.z.string().max(1000).trim().optional(),
    usageHoursAtCompletion: v4_1.z.number().min(0).optional(),
});
