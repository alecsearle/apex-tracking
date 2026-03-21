import { UsageSession } from "@/src/types/session";
import { apiRequest } from "./api";

interface StartSessionData {
  assetId: string;
  notes?: string;
  jobSiteName?: string;
}

interface EndSessionData {
  notes?: string;
  totalPausedMs?: number;
}

export const sessionService = {
  getActive: (businessId: string) =>
    apiRequest<UsageSession[]>(`/businesses/${businessId}/sessions/active`),

  getForAsset: (businessId: string, assetId: string) =>
    apiRequest<UsageSession[]>(`/businesses/${businessId}/assets/${assetId}/sessions`),

  start: (businessId: string, data: StartSessionData) =>
    apiRequest<UsageSession>(`/businesses/${businessId}/sessions`, {
      method: "POST",
      body: data,
    }),

  end: (businessId: string, sessionId: string, data?: EndSessionData) =>
    apiRequest<UsageSession>(`/businesses/${businessId}/sessions/${sessionId}/end`, {
      method: "PUT",
      body: data,
    }),
};
