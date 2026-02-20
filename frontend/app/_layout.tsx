import { useAuth } from "@/src/hooks/useAuth";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
