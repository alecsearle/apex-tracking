import { Sop } from "@/src/types/sop";
import { sopService } from "@/src/services/sopService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useSOPs(assetId?: string) {
  const { businessId } = useAuth();
  const [sops, setSops] = useState<Sop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await sopService.getAll(businessId, assetId);
      setSops(data);
    } catch (e: any) {
      setError(e.message || "Failed to load SOPs");
    } finally {
      setLoading(false);
    }
  }, [businessId, assetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sops, loading, error, refetch };
}

export function useSOP(id: string) {
  const { businessId } = useAuth();
  const [sop, setSop] = useState<Sop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await sopService.getById(businessId, id);
      setSop(data);
    } catch (e: any) {
      setError(e.message || "Failed to load SOP");
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sop, loading, error, refetch };
}
