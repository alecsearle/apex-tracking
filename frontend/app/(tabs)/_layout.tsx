import Icon from "@/src/components/Icon";
import { useColors } from "@/src/styles/globalColors";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopColor: colors.divider,
          borderTopWidth: 0.5,
          paddingTop: 4,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" iosName="house.fill" androidName="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: "Assets",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="build" iosName="wrench.fill" androidName="build" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" iosName="gearshape.fill" androidName="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
