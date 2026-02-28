import { useAuthContext } from "@/src/contexts/AuthContext";

export function useAuth() {
  const { session, loading, needsOnboarding, completeOnboarding } = useAuthContext();
  return { session, loading, needsOnboarding, completeOnboarding };
}
