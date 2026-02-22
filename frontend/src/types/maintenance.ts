export type ScheduleTrigger = "usage_hours" | "time_interval";
export type DueStatus = "on_track" | "due_soon" | "overdue";

export interface MaintenanceSchedule {
  id: string;
  assetId: string;
  businessId: string;
  createdBy: string;
  title: string;
  description?: string;
  triggerType: ScheduleTrigger;
  intervalHours?: number;
  intervalDays?: number;
  lastCompletedAt?: string;
  lastCompletedUsageHours?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  assetName: string;
  createdByName: string;
  dueStatus: DueStatus;
  dueInfo: string;
}

export interface MaintenanceLog {
  id: string;
  scheduleId: string;
  assetId: string;
  businessId: string;
  completedBy: string;
  completedAt: string;
  usageHoursAtCompletion?: number;
  notes?: string;
  createdAt: string;
  // Enriched fields
  completedByName: string;
}
