import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/src/services/api";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface MeResponse {
  user: { id: string; email: string };
  membership: { businessId: string; role: "owner" | "employee" } | null;
  business: { id: string; name: string; businessCode: string } | null;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  /** User's business membership — null if not yet onboarded */
  businessId: string | null;
  role: "owner" | "employee" | null;
  businessName: string | null;
  businessCode: string | null;
  needsOnboarding: boolean;
  /** Re-fetch /auth/me (call after creating/joining a business) */
  refreshProfile: () => Promise<void>;
  devLogin: () => void;
  devOnboardingLogin: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock session used for dev-only bypass login (UI development only — won't work with real API)
const MOCK_SESSION: Session = {
  access_token: "dev-mock-token",
  refresh_token: "dev-mock-refresh",
  expires_in: 999999,
  expires_at: Math.floor(Date.now() / 1000) + 999999,
  token_type: "bearer",
  user: {
    id: "dev-user-00000000-0000-0000-0000-000000000000",
    email: "dev@apextracking.local",
    app_metadata: {},
    user_metadata: { full_name: "Dev User" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [role, setRole] = useState<"owner" | "employee" | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [businessCode, setBusinessCode] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isDevSession, setIsDevSession] = useState(false);

  /**
   * Fetch user profile + membership from backend.
   * Determines whether user needs onboarding (no business yet).
   */
  const fetchProfile = useCallback(async () => {
    try {
      const me = await apiRequest<MeResponse>("/auth/me");
      if (me.membership) {
        setBusinessId(me.membership.businessId);
        setRole(me.membership.role);
        setBusinessName(me.business?.name ?? null);
        setBusinessCode(me.business?.businessCode ?? null);
        setNeedsOnboarding(false);
      } else {
        setBusinessId(null);
        setRole(null);
        setBusinessName(null);
        setBusinessCode(null);
        setNeedsOnboarding(true);
      }
    } catch {
      // If /auth/me fails (e.g. dev mock token), assume onboarding needed
      setBusinessId(null);
      setRole(null);
      setBusinessName(null);
      setBusinessCode(null);
      setNeedsOnboarding(true);
    }
  }, []);

  /**
   * Sync user to backend DB and fetch profile.
   * Called once when a real Supabase session is established.
   */
  const syncAndFetch = useCallback(
    async (currentSession: Session) => {
      try {
        // Sync user record to backend (idempotent upsert)
        await apiRequest("/auth/sync", { method: "POST" });
      } catch {
        // Sync may fail for dev sessions — continue to fetchProfile
      }
      await fetchProfile();
    },
    [fetchProfile]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        syncAndFetch(s).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        syncAndFetch(s);
      } else {
        // Logged out — reset state
        setBusinessId(null);
        setRole(null);
        setBusinessName(null);
        setBusinessCode(null);
        setNeedsOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [syncAndFetch]);

  function devLogin() {
    if (__DEV__) {
      setIsDevSession(true);
      setNeedsOnboarding(false);
      setSession(MOCK_SESSION);
      // Dev session — hooks will use empty states since API calls will fail
    }
  }

  function devOnboardingLogin() {
    if (__DEV__) {
      setIsDevSession(true);
      setNeedsOnboarding(true);
      setSession(MOCK_SESSION);
    }
  }

  function completeOnboarding() {
    setNeedsOnboarding(false);
    // If it's a real session, re-fetch profile to get the new membership
    if (!isDevSession) {
      fetchProfile();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        businessId,
        role,
        businessName,
        businessCode,
        needsOnboarding,
        refreshProfile: fetchProfile,
        devLogin,
        devOnboardingLogin,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
