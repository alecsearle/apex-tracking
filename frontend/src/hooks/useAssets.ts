import { Asset } from "@/src/types/asset";
import { assetService } from "@/src/services/assetService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useAssets() {
  const { businessId } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getAll(businessId);
      setAssets(data);
    } catch (e: any) {
      setError(e.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { assets, loading, error, refetch };
}
