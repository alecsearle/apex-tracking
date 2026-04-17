import Icon from "@/src/components/Icon";
import { useColors } from "@/src/styles/globalColors";
import { Stack, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

function BackToAssets() {
  const colors = useColors();
  const router = useRouter();
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      // No back stack (e.g. opened via deep link or NFC tap) — go to assets list
      router.replace("/assets");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={8}
      style={{ minWidth: 36, minHeight: 36, alignItems: "center", justifyContent: "center" }}
    >
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
