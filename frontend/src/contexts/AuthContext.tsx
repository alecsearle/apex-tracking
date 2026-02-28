import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  needsOnboarding: boolean;
  devLogin: () => void;
  devOnboardingLogin: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock session used for dev-only bypass login
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
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  function devLogin() {
    if (__DEV__) {
      setNeedsOnboarding(false);
      setSession(MOCK_SESSION);
    }
  }

  function devOnboardingLogin() {
    if (__DEV__) {
      setNeedsOnboarding(true);
      setSession(MOCK_SESSION);
    }
  }

  function completeOnboarding() {
    setNeedsOnboarding(false);
  }

  return (
    <AuthContext.Provider
      value={{ session, loading, needsOnboarding, devLogin, devOnboardingLogin, completeOnboarding }}
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
