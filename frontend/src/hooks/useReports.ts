import { getReportsForAsset, MOCK_REPORTS } from "@/src/mocks/mockData";
import { MaintenanceReport } from "@/src/types/report";
import { useCallback, useState } from "react";

export function useReports(assetId?: string) {
  const [reports] = useState<MaintenanceReport[]>(
    assetId ? getReportsForAsset(assetId) : MOCK_REPORTS
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { reports, loading, error, refetch };
}
