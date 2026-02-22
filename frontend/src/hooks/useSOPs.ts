import { getSOPsForAsset, MOCK_SOPS } from "@/src/mocks/mockData";
import { Sop } from "@/src/types/sop";
import { useCallback, useState } from "react";

export function useSOPs(assetId?: string) {
  const [sops] = useState<Sop[]>(
    assetId ? getSOPsForAsset(assetId) : MOCK_SOPS
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { sops, loading, error, refetch };
}

export function useSOP(id: string) {
  const [sop] = useState<Sop | null>(
    MOCK_SOPS.find((s) => s.id === id) ?? null
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { sop, loading, error, refetch };
}
