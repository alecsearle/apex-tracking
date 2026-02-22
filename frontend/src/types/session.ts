export type SessionStatus = "active" | "completed";

export interface UsageSession {
  id: string;
  assetId: string;
  startedBy: string;
  endedBy?: string;
  startedAt: string;
  endedAt?: string;
  notes?: string;
  status: SessionStatus;
  // Enriched fields from joins
  assetName: string;
  startedByName: string;
  endedByName?: string;
}
