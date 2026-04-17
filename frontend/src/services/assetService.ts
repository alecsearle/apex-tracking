import { Asset, CreateAssetDTO, UpdateAssetDTO } from "@/src/types/asset";
import { apiRequest, apiUpload } from "./api";

/** All routes are business-scoped: /businesses/:businessId/assets */
export const assetService = {
  getAll: (businessId: string) =>
    apiRequest<Asset[]>(`/businesses/${businessId}/assets`),

  getById: (businessId: string, id: string) =>
    apiRequest<Asset>(`/businesses/${businessId}/assets/${id}`),

  create: (businessId: string, data: CreateAssetDTO) =>
    apiRequest<Asset>(`/businesses/${businessId}/assets`, {
      method: "POST",
      body: data,
    }),

  update: (businessId: string, id: string, data: UpdateAssetDTO) =>
    apiRequest<Asset>(`/businesses/${businessId}/assets/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (businessId: string, id: string) =>
    apiRequest<void>(`/businesses/${businessId}/assets/${id}`, {
      method: "DELETE",
    }),

  uploadPhoto: async (
    businessId: string,
    id: string,
    fileUri: string,
    fileName: string,
    mimeType?: string
  ) => {
    const formData = new FormData();
    formData.append("photo", {
      uri: fileUri,
      name: fileName,
      type: mimeType || "image/jpeg",
    } as any);
    return apiUpload<Asset>(`/businesses/${businessId}/assets/${id}/photo`, formData);
  },

  deletePhoto: (businessId: string, id: string) =>
    apiRequest<void>(`/businesses/${businessId}/assets/${id}/photo`, {
      method: "DELETE",
    }),

  uploadManual: async (businessId: string, id: string, fileUri: string, fileName: string) => {
    const formData = new FormData();
    formData.append("manual", {
      uri: fileUri,
      name: fileName,
      type: "application/pdf",
    } as any);
    return apiUpload<Asset>(`/businesses/${businessId}/assets/${id}/manual`, formData);
  },

  deleteManual: (businessId: string, id: string) =>
    apiRequest<void>(`/businesses/${businessId}/assets/${id}/manual`, {
      method: "DELETE",
    }),
};
