import { useCallback, useEffect, useState } from "react";
import { Asset } from "@/src/types/asset";
import { assetService } from "@/src/services/assetService";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, loading, error, refetch: fetchAssets };
}
