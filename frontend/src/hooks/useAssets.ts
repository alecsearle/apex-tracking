import { MOCK_ASSETS } from "@/src/mocks/mockData";
import { Asset } from "@/src/types/asset";
import { useCallback, useState } from "react";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setAssets([...MOCK_ASSETS]);
  }, []);

  return { assets, loading, error, refetch };
}
