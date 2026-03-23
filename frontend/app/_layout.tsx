import { AuthProvider } from "@/src/contexts/AuthContext";
import Button from "@/src/components/Button";
import { useAuth } from "@/src/hooks/useAuth";
import { useColors } from "@/src/styles/globalColors";
import * as Linking from "expo-linking";
import { router, useSegments, Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

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

function useProtectedRoute() {
  const { session, loading, needsOnboarding, profileError } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Don't redirect if we have a profile error — the error screen handles it
    if (profileError) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!session) {
      // Not signed in → must be in auth group (login/signup), redirect if not
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else if (needsOnboarding) {
      // Signed in but no business → must be on onboarding
      if (!inAuthGroup || segments[1] !== "onboarding") {
        router.replace("/(auth)/onboarding");
      }
    } else {
      // Signed in with business → must be in tabs
      if (!inTabsGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [session, loading, needsOnboarding, profileError, segments]);
}

function RootNavigator() {
  const { session, loading, profileError, refreshProfile } = useAuth();
  const colors = useColors();
  useDeepLinkHandler();
  useProtectedRoute();

  if (loading) return null;

  // Backend unreachable while logged in — show retry
  if (session && profileError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ color: colors.textHeading, fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Connection Error
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 24 }}>
          Could not reach the server. Check your connection and try again.
        </Text>
        <Button variant="primary" onPress={refreshProfile}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
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
