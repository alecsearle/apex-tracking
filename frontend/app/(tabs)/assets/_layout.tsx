import { useColors } from "@/src/styles/globalColors";
import { Stack } from "expo-router";

export default function AssetsLayout() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.backgroundCard,
        },
        headerTintColor: colors.brandPrimary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
          color: colors.textHeading,
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Assets" }} />
      <Stack.Screen name="[id]" options={{ title: "Asset Details" }} />
      <Stack.Screen name="new" options={{ title: "Add Asset" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Asset" }} />
    </Stack>
  );
}
