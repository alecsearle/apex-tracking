import { v4 as uuidv4 } from "uuid";
import {
  CreateMaintenanceRecordDTO,
  MaintenanceRecord,
  UpdateMaintenanceRecordDTO,
} from "../models/MaintenanceRecord";

// Temporary in-memory storage
let maintenanceRecords: MaintenanceRecord[] = [];

export const maintenanceService = {
  // Get all maintenance records for a specific asset, sorted by most recent date
  getByAssetId: async (assetId: string): Promise<MaintenanceRecord[]> => {
    return maintenanceRecords
      .filter((record) => record.assetId === assetId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Get all maintenance records (across all assets), sorted by most recent date
  getAll: async (): Promise<MaintenanceRecord[]> => {
    return maintenanceRecords.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  },

  // Get a single maintenance record by its ID
  getById: async (id: string): Promise<MaintenanceRecord | null> => {
    const record = maintenanceRecords.find((r) => r.id === id);
    return record || null;
  },

  // Create a new maintenance record
  create: async (recordData: CreateMaintenanceRecordDTO): Promise<MaintenanceRecord> => {
    const newRecord: MaintenanceRecord = {
      id: uuidv4(),
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    maintenanceRecords.push(newRecord);
    return newRecord;
  },

  // Update a maintenance record
  update: async (
    id: string,
    updates: UpdateMaintenanceRecordDTO,
  ): Promise<MaintenanceRecord | null> => {
    const recordIndex = maintenanceRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return null;
    }

    maintenanceRecords[recordIndex] = {
      ...maintenanceRecords[recordIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return maintenanceRecords[recordIndex];
  },

  delete: async (id: string): Promise<boolean> => {
    const recordIndex = maintenanceRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return false;
    }

    maintenanceRecords.splice(recordIndex, 1);
    return true;
  },
};
