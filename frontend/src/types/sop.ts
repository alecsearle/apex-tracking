export type SopSource = "manual" | "custom";

export interface Sop {
  id: string;
  businessId: string;
  assetId?: string;
  title: string;
  content: string;
  source: SopSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Enriched fields from joins
  assetName?: string;
  createdByName: string;
}
