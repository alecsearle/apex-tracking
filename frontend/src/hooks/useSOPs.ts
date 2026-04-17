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

  const updateSop = useCallback(
    async (updates: { title?: string; content?: string }) => {
      if (!businessId) return null;
      try {
        const updated = await sopService.update(businessId, id, updates);
        setSop(updated);
        return updated;
      } catch (e: any) {
        setError(e.message || "Failed to update SOP");
        return null;
      }
    },
    [businessId, id]
  );

  const deleteSop = useCallback(async () => {
    if (!businessId) return;
    try {
      await sopService.delete(businessId, id);
      setSop(null);
    } catch (e: any) {
      setError(e.message || "Failed to delete SOP");
    }
  }, [businessId, id]);

  return { sop, loading, error, refetch, updateSop, deleteSop };
}
