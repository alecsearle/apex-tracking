import { AuthProvider } from "@/src/contexts/AuthContext";
import { useAuth } from "@/src/hooks/useAuth";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

function useDeepLinkHandler() {
  useEffect(() => {
    function handleDeepLink(event: { url: string }) {
      const url = event.url;
      if (!url) return;

      const path = url.replace(/^apextracking:\/\//, "");

      const assetMatch = path.match(/^assets\/(.+)$/);
      if (assetMatch) {
        router.push(`/(tabs)/assets/${assetMatch[1]}`);
        return;
      }
    }

    // Cold start: app opened from NFC tag tap
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Warm start: app already running
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);
}

function RootNavigator() {
  const { session, loading } = useAuth();
  useDeepLinkHandler();

  if (loading) return null;

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
