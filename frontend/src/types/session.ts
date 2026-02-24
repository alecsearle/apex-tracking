export type SessionStatus = "active" | "paused" | "completed";

export interface UsageSession {
  id: string;
  assetId: string;
  startedBy: string;
  endedBy?: string;
  startedAt: string;
  endedAt?: string;
  pausedAt?: string;
  totalPausedMs?: number;
  notes?: string;
  jobSiteName?: string;
  status: SessionStatus;
  // Enriched fields from joins
  assetName: string;
  startedByName: string;
  endedByName?: string;
}
