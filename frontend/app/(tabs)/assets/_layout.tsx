import Icon from "@/src/components/Icon";
import { useColors } from "@/src/styles/globalColors";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

function BackToAssets() {
  const colors = useColors();
  const router = useRouter();
  const navigation = useNavigation();

  // If there's a normal back destination, let the default header handle it
  if (navigation.canGoBack()) return undefined;

  // No back stack (e.g. opened via deep link or cross-tab push) — show manual back button
  return (
    <TouchableOpacity onPress={() => router.replace("/assets")} hitSlop={8}>
      <Icon
        name="arrow-back"
        iosName="chevron.left"
        androidName="arrow-back"
        size={22}
        color={colors.brandPrimary}
      />
    </TouchableOpacity>
  );
}

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
      <Stack.Screen
        name="[id]"
        options={{ title: "Asset Details", headerLeft: () => <BackToAssets /> }}
      />
      <Stack.Screen name="new" options={{ title: "Add Asset" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Asset" }} />
      <Stack.Screen name="sop/[id]" options={{ title: "SOP Details" }} />
      <Stack.Screen name="maintenance/[id]" options={{ title: "Schedule Details" }} />
      <Stack.Screen name="maintenance/complete/[id]" options={{ title: "Complete Maintenance" }} />
      <Stack.Screen name="manual/[id]" options={{ title: "PDF Manual" }} />
    </Stack>
  );
}
