export type ReportSeverity = "low" | "medium" | "high" | "critical";
export type ReportStatus = "open" | "in_progress" | "resolved";

export interface MaintenanceReport {
  id: string;
  assetId: string;
  sessionId?: string;
  businessId: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  assetName: string;
  reportedByName: string;
  photos: ReportPhoto[];
}

export interface ReportPhoto {
  id: string;
  reportId: string;
  photoUrl: string;
  caption?: string;
  createdAt: string;
}
