import { MOCK_MEMBERSHIPS } from "@/src/mocks/mockData";
import { Membership } from "@/src/types/business";
import { useCallback, useState } from "react";

export function useMembers() {
  const [members] = useState<Membership[]>(MOCK_MEMBERSHIPS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {}, []);

  return { members, loading, error, refetch };
}
