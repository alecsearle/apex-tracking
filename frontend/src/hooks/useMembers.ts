import { Membership } from "@/src/types/business";
import { businessService } from "@/src/services/businessService";
import { useAuth } from "./useAuth";
import { useCallback, useEffect, useState } from "react";

export function useMembers() {
  const { businessId } = useAuth();
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await businessService.getMembers(businessId);
      setMembers(data);
    } catch (e: any) {
      setError(e.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { members, loading, error, refetch };
}
