import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, loading, needsOnboarding } = useAuth();

  if (loading) return null;
  if (session && !needsOnboarding) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
