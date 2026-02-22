import { MOCK_ASSETS } from "@/src/mocks/mockData";
import { Asset } from "@/src/types/asset";
import { useCallback, useState } from "react";

export function useAssets() {
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    // No-op for mock data
  }, []);

  return { assets, loading, error, refetch };
}
