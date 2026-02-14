export interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  task: string;
  description?: string;
  performedBy?: string;
  cost?: number;
  hoursOfUse?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRecordDTO {
  assetId: string;
  date: string;
  task: string;
  description?: string;
  performedBy?: string;
  cost?: number;
  hoursOfUse?: number;
}

export interface UpdateMaintenanceRecordDTO {
  date?: string;
  task?: string;
  description?: string;
  performedBy?: string;
  cost?: number;
  hoursOfUse?: number;
}
