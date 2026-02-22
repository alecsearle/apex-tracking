import { useAuthContext } from "@/src/contexts/AuthContext";

export function useAuth() {
  const { session, loading } = useAuthContext();
  return { session, loading };
}
