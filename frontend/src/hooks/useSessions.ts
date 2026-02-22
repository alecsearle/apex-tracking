import { getActiveSessions, getSessionsForAsset } from "@/src/mocks/mockData";
import { UsageSession } from "@/src/types/session";
import { useCallback, useState } from "react";

export function useSessions(assetId?: string) {
  const [sessions] = useState<UsageSession[]>(
    assetId ? getSessionsForAsset(assetId) : getActiveSessions()
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { sessions, loading, error, refetch };
}
