import { MaterialIcons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform } from "react-native";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  iosName?: string; // optional override
  androidName?: string; // optional override
};

// PlatformIcon automatically selects correct icon library based on OS
// You can also overrisde icon names for iOS vs Android if you need
const Icon = ({ name, size = 24, color = "black", iosName, androidName }: IconProps) => {
  const isIOS = Platform.OS === "ios";

  // Use different icon names if specified
  const iconName = isIOS ? iosName || name : androidName || name;

  if (isIOS) {
    return <SymbolView name={iconName as any} size={size} tintColor={color} />;
  }

  return <MaterialIcons name={iconName as any} size={size} color={color} />;
};

export default Icon;
