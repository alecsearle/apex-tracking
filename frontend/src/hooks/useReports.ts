import { MaintenanceReport } from "@/src/types/report";
import { reportService } from "@/src/services/reportService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useReports(assetId?: string) {
  const { businessId } = useAuth();
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getAll(businessId, assetId ? { assetId } : undefined);
      setReports(data);
    } catch (e: any) {
      setError(e.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [businessId, assetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { reports, loading, error, refetch };
}
