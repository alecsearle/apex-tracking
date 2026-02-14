export interface UsageSession {
  id: string;
  assetId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  type: "manual" | "timed";
  status: "active" | "completed" | "abandoned";
  description?: string;
  location?: string;
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManualUsageDTO {
  assetId: string;
  startTime: string;
  duration: number;
  description?: string;
  location?: string;
  performedBy?: string;
}

export interface StartTimedSessionDTO {
  assetId: string;
  location?: string;
  performedBy?: string;
}

export interface StopTimedSessionDTO {
  description?: string;
}

export interface UpdateUsageSessionDTO {
  startTime?: string;
  endTime?: string;
  duration?: number;
  description?: string;
  location?: string;
  performedBy?: string;
  status?: "completed" | "abandoned";
}
