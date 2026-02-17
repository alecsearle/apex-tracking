import { Asset, CreateAssetDTO, UpdateAssetDTO } from "@/src/types/asset";
import { API_BASE_URL, apiRequest } from "./api";

interface UploadManualResponse {
  message: string;
  asset: Asset;
  filename: string;
}

export const assetService = {
  getAll: () => apiRequest<Asset[]>("/assets"),

  getById: (id: string) => apiRequest<Asset>(`/assets/${id}`),

  create: (data: CreateAssetDTO) =>
    apiRequest<Asset>("/assets", { method: "POST", body: data }),

  update: (id: string, data: UpdateAssetDTO) =>
    apiRequest<Asset>(`/assets/${id}`, { method: "PUT", body: data }),

  delete: (id: string) =>
    apiRequest<void>(`/assets/${id}`, { method: "DELETE" }),

  uploadManual: async (id: string, fileUri: string, fileName: string): Promise<UploadManualResponse> => {
    const formData = new FormData();
    formData.append("manual", {
      uri: fileUri,
      name: fileName,
      type: "application/pdf",
    } as any);

    const response = await fetch(`${API_BASE_URL}/assets/${id}/manual`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload manual");
    }

    return response.json();
  },

  getManualUrl: (id: string) => `${API_BASE_URL}/assets/${id}/manual`,

  deleteManual: (id: string) =>
    apiRequest<void>(`/assets/${id}/manual`, { method: "DELETE" }),
};
