import Icon from "@/src/components/Icon";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
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
    </>
  );
}
