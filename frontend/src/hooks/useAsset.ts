import { Asset, UpdateAssetDTO } from "@/src/types/asset";
import { assetService } from "@/src/services/assetService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useAsset(id: string) {
  const { businessId } = useAuth();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getById(businessId, id);
      setAsset(data);
    } catch (e: any) {
      setError(e.message || "Failed to load asset");
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateAsset = useCallback(
    async (updates: UpdateAssetDTO) => {
      if (!businessId) return null;
      try {
        const updated = await assetService.update(businessId, id, updates);
        setAsset(updated);
        return updated;
      } catch (e: any) {
        setError(e.message || "Failed to update asset");
        return null;
      }
    },
    [businessId, id]
  );

  const deleteAsset = useCallback(async () => {
    if (!businessId) return;
    try {
      await assetService.delete(businessId, id);
      setAsset(null);
    } catch (e: any) {
      setError(e.message || "Failed to delete asset");
    }
  }, [businessId, id]);

  return { asset, loading, error, refetch, updateAsset, deleteAsset };
}
