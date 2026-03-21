import { MaintenanceSchedule, MaintenanceLog } from "@/src/types/maintenance";
import { apiRequest, apiUpload } from "./api";

interface CreateScheduleData {
  assetId: string;
  title: string;
  description?: string;
  triggerType: "usage_hours" | "time_interval";
  intervalHours?: number;
  intervalDays?: number;
}

interface UpdateScheduleData {
  title?: string;
  description?: string;
  active?: boolean;
  intervalHours?: number;
  intervalDays?: number;
}

interface CompleteScheduleData {
  notes?: string;
}

export const maintenanceService = {
  getSchedules: (businessId: string, assetId?: string) => {
    const query = assetId ? `?assetId=${assetId}` : "";
    return apiRequest<MaintenanceSchedule[]>(
      `/businesses/${businessId}/maintenance/schedules${query}`
    );
  },

  getScheduleById: (businessId: string, id: string) =>
    apiRequest<MaintenanceSchedule>(`/businesses/${businessId}/maintenance/schedules/${id}`),

  getForAsset: (businessId: string, assetId: string) =>
    apiRequest<MaintenanceSchedule[]>(
      `/businesses/${businessId}/assets/${assetId}/maintenance`
    ),

  createSchedule: (businessId: string, data: CreateScheduleData) =>
    apiRequest<MaintenanceSchedule>(`/businesses/${businessId}/maintenance/schedules`, {
      method: "POST",
      body: data,
    }),

  updateSchedule: (businessId: string, id: string, data: UpdateScheduleData) =>
    apiRequest<MaintenanceSchedule>(`/businesses/${businessId}/maintenance/schedules/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteSchedule: (businessId: string, id: string) =>
    apiRequest<void>(`/businesses/${businessId}/maintenance/schedules/${id}`, {
      method: "DELETE",
    }),

  completeSchedule: (businessId: string, id: string, data?: CompleteScheduleData) =>
    apiRequest<MaintenanceLog>(
      `/businesses/${businessId}/maintenance/schedules/${id}/complete`,
      { method: "POST", body: data }
    ),

  getLogs: (businessId: string, scheduleId: string) =>
    apiRequest<MaintenanceLog[]>(
      `/businesses/${businessId}/maintenance/schedules/${scheduleId}/logs`
    ),

  getDueSchedules: (businessId: string) =>
    apiRequest<MaintenanceSchedule[]>(`/businesses/${businessId}/maintenance/due`),

  addLogPhoto: async (
    businessId: string,
    logId: string,
    fileUri: string,
    fileName: string
  ) => {
    const formData = new FormData();
    formData.append("photo", {
      uri: fileUri,
      name: fileName,
      type: "image/jpeg",
    } as any);
    return apiUpload(`/businesses/${businessId}/maintenance/logs/${logId}/photos`, formData);
  },

  deleteLogPhoto: (businessId: string, logId: string, photoId: string) =>
    apiRequest<void>(
      `/businesses/${businessId}/maintenance/logs/${logId}/photos/${photoId}`,
      { method: "DELETE" }
    ),
};
