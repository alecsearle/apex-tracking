import { MOCK_ASSETS, mockDeleteAsset } from "@/src/mocks/mockData";
import { Asset } from "@/src/types/asset";
import { useCallback, useState } from "react";

export function useAsset(id: string) {
  const [asset, setAsset] = useState<Asset | null>(
    MOCK_ASSETS.find((a) => a.id === id) ?? null,
  );
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setAsset(MOCK_ASSETS.find((a) => a.id === id) ?? null);
  }, [id]);

  const deleteAsset = useCallback(() => {
    mockDeleteAsset(id);
    setAsset(null);
  }, [id]);

  return { asset, loading, error, refetch, deleteAsset };
}
