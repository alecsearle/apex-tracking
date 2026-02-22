import Icon from "@/src/components/Icon";
import { useAuth } from "@/src/hooks/useAuth";
import { useColors } from "@/src/styles/globalColors";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { session, loading } = useAuth();
  const colors = useColors();

  if (loading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

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
            <Icon
              name="build"
              iosName="wrench.fill"
              androidName="build"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="handyman"
              iosName="wrench.and.screwdriver.fill"
              androidName="handyman"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sops"
        options={{
          title: "SOPs",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="menu-book"
              iosName="doc.text.fill"
              androidName="menu-book"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="settings"
              iosName="gearshape.fill"
              androidName="settings"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
