import { MaintenanceSchedule } from "@/src/types/maintenance";
import { maintenanceService } from "@/src/services/maintenanceService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useMaintenanceSchedule(id: string) {
  const { businessId } = useAuth();
  const [schedule, setSchedule] = useState<MaintenanceSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.getScheduleById(businessId, id);
      setSchedule(data);
    } catch (e: any) {
      setError(e.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { schedule, loading, error, refetch };
}
