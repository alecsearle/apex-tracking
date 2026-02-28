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
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Assets" }} />
      <Stack.Screen name="[id]" options={{ title: "Asset Details" }} />
      <Stack.Screen name="new" options={{ title: "Add Asset" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Asset" }} />
      <Stack.Screen name="sop/[id]" options={{ title: "SOP Details" }} />
      <Stack.Screen name="maintenance/[id]" options={{ title: "Schedule Details" }} />
      <Stack.Screen name="maintenance/complete/[id]" options={{ title: "Complete Maintenance" }} />
      <Stack.Screen name="manual/[id]" options={{ title: "PDF Manual" }} />
      <Stack.Screen name="write-nfc/[id]" options={{ title: "Program NFC Tag" }} />
    </Stack>
  );
}
