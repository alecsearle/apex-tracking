// Usage Session - represents a period of time the asset was used

export interface UsageSession {
  id: string;
  assetId: string;
  startTime: string;
  endTime?: string; // ISO Timestamp or undefined if active session
  duration?: number;
  type: "manual" | "timed";
  status: "active" | "completed" | "abandoned";
  description?: string;
  location?: string;
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a manual usage entry
export interface CreateManualUsageDTO {
  assetId: string;
  startTime: string;
  duration: number;
  description?: string;
  location?: string;
  performedBy?: string;
}

// DTO for starting a timed session
export interface StartTimedSessionDTO {
  assetId: string;
  location?: string;
  performedBy?: string;
}

// DTO for stopping a timed session
export interface StopTimedSessionDTO {
  description?: string;
}

// DTO for updating a usage session (or fixing abandoned sessions)
export interface UpdateUsageSessionDTO {
  startTime?: string;
  endTime?: string;
  duration?: number;
  description?: string;
  location?: string;
  performedBy?: string;
  status?: "completed" | "abandoned"; // Don't allow changing back to active
}
