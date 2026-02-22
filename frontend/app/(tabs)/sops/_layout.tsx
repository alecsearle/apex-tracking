import { useColors } from "@/src/styles/globalColors";
import { Stack } from "expo-router";

export default function SOPsLayout() {
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
      <Stack.Screen name="index" options={{ title: "SOPs" }} />
      <Stack.Screen name="[id]" options={{ title: "SOP Detail" }} />
      <Stack.Screen name="new" options={{ title: "New SOP" }} />
    </Stack>
  );
}
