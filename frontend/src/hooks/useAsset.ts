import { MOCK_ASSETS } from "@/src/mocks/mockData";
import { Asset } from "@/src/types/asset";
import { useCallback, useState } from "react";

export function useAsset(id: string) {
  const [asset] = useState<Asset | null>(
    MOCK_ASSETS.find((a) => a.id === id) ?? null
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    // No-op for mock data
  }, []);

  return { asset, loading, error, refetch };
}
