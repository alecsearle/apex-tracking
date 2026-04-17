import { useAuthContext } from "@/src/contexts/AuthContext";

export function useAuth() {
  const {
    session,
    loading,
    businessId,
    role,
    businessName,
    businessCode,
    avatarUrl,
    needsOnboarding,
    profileError,
    refreshProfile,
    completeOnboarding,
  } = useAuthContext();

  return {
    session,
    loading,
    businessId,
    role,
    businessName,
    businessCode,
    avatarUrl,
    needsOnboarding,
    profileError,
    refreshProfile,
    completeOnboarding,
  };
}
