import { Asset, CreateAssetDTO, UpdateAssetDTO } from "@/src/types/asset";
import { apiRequest } from "./api";

export const assetService = {
  getAll: () => apiRequest<Asset[]>("/assets"),

  getById: (id: string) => apiRequest<Asset>(`/assets/${id}`),

  create: (data: CreateAssetDTO) =>
    apiRequest<Asset>("/assets", { method: "POST", body: data }),

  update: (id: string, data: UpdateAssetDTO) =>
    apiRequest<Asset>(`/assets/${id}`, { method: "PUT", body: data }),

  delete: (id: string) =>
    apiRequest<void>(`/assets/${id}`, { method: "DELETE" }),
};
