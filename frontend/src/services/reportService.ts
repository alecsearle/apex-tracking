import { MaintenanceReport } from "@/src/types/report";
import { apiRequest, apiUpload } from "./api";

interface CreateReportData {
  assetId: string;
  sessionId?: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface UpdateReportData {
  title?: string;
  description?: string;
  severity?: "low" | "medium" | "high" | "critical";
  status?: "open" | "in_progress" | "resolved";
}

export const reportService = {
  getAll: (businessId: string, filters?: { assetId?: string; severity?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.assetId) params.set("assetId", filters.assetId);
    if (filters?.severity) params.set("severity", filters.severity);
    if (filters?.status) params.set("status", filters.status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<MaintenanceReport[]>(`/businesses/${businessId}/reports${query}`);
  },

  getById: (businessId: string, id: string) =>
    apiRequest<MaintenanceReport>(`/businesses/${businessId}/reports/${id}`),

  create: (businessId: string, data: CreateReportData) =>
    apiRequest<MaintenanceReport>(`/businesses/${businessId}/reports`, {
      method: "POST",
      body: data,
    }),

  update: (businessId: string, id: string, data: UpdateReportData) =>
    apiRequest<MaintenanceReport>(`/businesses/${businessId}/reports/${id}`, {
      method: "PUT",
      body: data,
    }),

  addPhoto: async (businessId: string, reportId: string, fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append("photo", {
      uri: fileUri,
      name: fileName,
      type: "image/jpeg",
    } as any);
    return apiUpload(`/businesses/${businessId}/reports/${reportId}/photos`, formData);
  },

  deletePhoto: (businessId: string, reportId: string, photoId: string) =>
    apiRequest<void>(
      `/businesses/${businessId}/reports/${reportId}/photos/${photoId}`,
      { method: "DELETE" }
    ),
};
