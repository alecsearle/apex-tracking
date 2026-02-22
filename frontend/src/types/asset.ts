export type AssetStatus = "available" | "in_use" | "maintenance";

export interface Asset {
  id: string;
  businessId: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  nfcTagId?: string;
  photoUrl?: string;
  manualUrl?: string;
  status: AssetStatus;
  totalUsageHours: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetDTO {
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  nfcTagId?: string;
}

export interface UpdateAssetDTO {
  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  nfcTagId?: string;
}
