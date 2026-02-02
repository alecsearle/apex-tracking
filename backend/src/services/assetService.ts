import { v4 as uuidv4 } from "uuid";
import { Asset, CreateAssetDTO, UpdateAssetDTO } from "../models/Asset";

// Temporary in-memory storage for assets
// This will be replaced by a database in real application
let assets: Asset[] = [];

// Asset Service - handles all business logic for asset management
export const assetService = {
  // Return array of all assets
  getAll: async (): Promise<Asset[]> => {
    return assets;
  },

  // Return asset by ID
  getById: async (id: string): Promise<Asset | null> => {
    const asset = assets.find((a) => a.id === id);
    return asset || null;
  },

  // Create a new asset
  create: async (assetData: CreateAssetDTO): Promise<Asset> => {
    const newAsset: Asset = {
      id: uuidv4(), // Generate unique ID
      ...assetData, // Spread user-provided data
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assets.push(newAsset);
    return newAsset;
  },

  // Update existing asset
  update: async (id: string, updates: UpdateAssetDTO): Promise<Asset | null> => {
    const assetIndex = assets.findIndex((a) => a.id === id);

    if (assetIndex === -1) {
      return null;
    }

    // Merge updates with existing asset
    assets[assetIndex] = {
      ...assets[assetIndex],
      ...updates,
      updatedAt: new Date().toISOString(), // Update timestamp
    };

    return assets[assetIndex];
  },

  // Delete asset by ID
  delete: async (id: string): Promise<boolean> => {
    const assetIndex = assets.findIndex((a) => a.id === id);

    if (assetIndex === -1) {
      return false;
    }

    assets.splice(assetIndex, 1);
    return true;
  },
};
