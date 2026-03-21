import { Business, Membership } from "@/src/types/business";
import { apiRequest } from "./api";

export const businessService = {
  create: (name: string) =>
    apiRequest<{ business: Business; membership: Membership }>("/businesses", {
      method: "POST",
      body: { name },
    }),

  join: (businessCode: string) =>
    apiRequest<{ business: Business; membership: Membership }>("/businesses/join", {
      method: "POST",
      body: { businessCode },
    }),

  get: (businessId: string) =>
    apiRequest<Business>(`/businesses/${businessId}`),

  update: (businessId: string, data: { name?: string }) =>
    apiRequest<Business>(`/businesses/${businessId}`, {
      method: "PUT",
      body: data,
    }),

  getMembers: (businessId: string) =>
    apiRequest<Membership[]>(`/businesses/${businessId}/members`),

  removeMember: (businessId: string, userId: string) =>
    apiRequest<void>(`/businesses/${businessId}/members/${userId}`, {
      method: "DELETE",
    }),
};
