// An Asset includes any piece of equipment: tools, machinery, vehicles, etc.
export interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  nfcTagId?: string;
  maintenanceSchedule?: MaintenanceSchedule[];
  createdAt: string;
  updatedAt: string;
}

// Maintenance Schedule defines when maintenance should be performed
export interface MaintenanceSchedule {
  interval: number; // How often (in days)
  intervalType: "hours" | "days" | "weeks" | "months";
  task: string;
  description?: string;
}

// DTO (Data Transfer Object) for creating a new Asset
export interface CreateAssetDTO {
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  nfcTagId?: string;
}

// DTO for updating an existing Asset (all fields are optional)
export interface UpdateAssetDTO {
  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  nfcTagId?: string;
}

///// Example Usage /////

const testAsset: Asset = {
  id: "123",
  name: "Test Chainsaw",
  brand: "Test Brand",
  model: "Model X",
  serialNumber: "SN999",
  purchaseDate: "2024-01-15",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

const testCreate: CreateAssetDTO = {
  name: "New Asset",
  brand: "Brand",
  model: "Model",
  serialNumber: "SN001",
  purchaseDate: "2024-01-15",
};

console.log("Types are working correctly!");
