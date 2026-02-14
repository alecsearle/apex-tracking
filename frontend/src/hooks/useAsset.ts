import { useCallback, useEffect, useState } from "react";
import { Asset } from "@/src/types/asset";
import { assetService } from "@/src/services/assetService";

export function useAsset(id: string) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsset = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getById(id);
      setAsset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load asset");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  return { asset, loading, error, refetch: fetchAsset };
}
