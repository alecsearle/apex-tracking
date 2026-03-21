import { MaintenanceSchedule } from "@/src/types/maintenance";
import { maintenanceService } from "@/src/services/maintenanceService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useMaintenanceSchedules(assetId?: string) {
  const { businessId } = useAuth();
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = assetId
        ? await maintenanceService.getForAsset(businessId, assetId)
        : await maintenanceService.getSchedules(businessId);
      setSchedules(data);
    } catch (e: any) {
      setError(e.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }, [businessId, assetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const overdue = schedules.filter((s) => s.dueStatus === "overdue");
  const dueSoon = schedules.filter((s) => s.dueStatus === "due_soon");
  const onTrack = schedules.filter((s) => s.dueStatus === "on_track");

  return { schedules, overdue, dueSoon, onTrack, loading, error, refetch };
}
