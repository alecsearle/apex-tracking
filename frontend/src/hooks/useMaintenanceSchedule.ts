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

  const updateSchedule = useCallback(
    async (updates: { title?: string; description?: string; active?: boolean; intervalHours?: number; intervalDays?: number }) => {
      if (!businessId) return null;
      try {
        const updated = await maintenanceService.updateSchedule(businessId, id, updates);
        setSchedule(updated);
        return updated;
      } catch (e: any) {
        setError(e.message || "Failed to update schedule");
        return null;
      }
    },
    [businessId, id]
  );

  const deleteSchedule = useCallback(async () => {
    if (!businessId) return;
    try {
      await maintenanceService.deleteSchedule(businessId, id);
      setSchedule(null);
    } catch (e: any) {
      setError(e.message || "Failed to delete schedule");
    }
  }, [businessId, id]);

  return { schedule, loading, error, refetch, updateSchedule, deleteSchedule };
}
