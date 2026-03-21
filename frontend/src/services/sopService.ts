import { Sop } from "@/src/types/sop";
import { apiRequest } from "./api";

interface CreateSopData {
  assetId?: string;
  title: string;
  content: string;
}

interface UpdateSopData {
  title?: string;
  content?: string;
}

export const sopService = {
  getAll: (businessId: string, assetId?: string) => {
    const query = assetId ? `?assetId=${assetId}` : "";
    return apiRequest<Sop[]>(`/businesses/${businessId}/sops${query}`);
  },

  getById: (businessId: string, id: string) =>
    apiRequest<Sop>(`/businesses/${businessId}/sops/${id}`),

  create: (businessId: string, data: CreateSopData) =>
    apiRequest<Sop>(`/businesses/${businessId}/sops`, {
      method: "POST",
      body: data,
    }),

  update: (businessId: string, id: string, data: UpdateSopData) =>
    apiRequest<Sop>(`/businesses/${businessId}/sops/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (businessId: string, id: string) =>
    apiRequest<void>(`/businesses/${businessId}/sops/${id}`, {
      method: "DELETE",
    }),
};
