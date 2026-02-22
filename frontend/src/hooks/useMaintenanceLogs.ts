import { getLogsForSchedule } from "@/src/mocks/mockData";
import { MaintenanceLog } from "@/src/types/maintenance";
import { useCallback, useState } from "react";

export function useMaintenanceLogs(scheduleId: string) {
  const [logs] = useState<MaintenanceLog[]>(getLogsForSchedule(scheduleId));
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { logs, loading, error, refetch };
}
