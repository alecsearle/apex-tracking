import { MaintenanceLog } from "@/src/types/maintenance";
import { maintenanceService } from "@/src/services/maintenanceService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useMaintenanceLogs(scheduleId: string) {
  const { businessId } = useAuth();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.getLogs(businessId, scheduleId);
      setLogs(data);
    } catch (e: any) {
      setError(e.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [businessId, scheduleId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { logs, loading, error, refetch };
}
