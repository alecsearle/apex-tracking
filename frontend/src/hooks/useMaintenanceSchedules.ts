import {
  getDueSoonSchedules,
  getOverdueSchedules,
  getSchedulesForAsset,
  MOCK_SCHEDULES,
} from "@/src/mocks/mockData";
import { MaintenanceSchedule } from "@/src/types/maintenance";
import { useCallback, useState } from "react";

export function useMaintenanceSchedules(assetId?: string) {
  const [schedules] = useState<MaintenanceSchedule[]>(
    assetId ? getSchedulesForAsset(assetId) : MOCK_SCHEDULES
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  const overdue = schedules.filter((s) => s.dueStatus === "overdue");
  const dueSoon = schedules.filter((s) => s.dueStatus === "due_soon");
  const onTrack = schedules.filter((s) => s.dueStatus === "on_track");

  return { schedules, overdue, dueSoon, onTrack, loading, error, refetch };
}
