export interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  nfcTagId?: string;
  maintenanceSchedule?: MaintenanceSchedule[];
  manualFileName?: string;
  totalUsageHours?: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceSchedule {
  interval: number;
  intervalType: "hours" | "days" | "weeks" | "months";
  task: string;
  description?: string;
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
