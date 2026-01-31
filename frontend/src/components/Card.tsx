import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "small" | "medium" | "large";
  style?: ViewStyle;
}

const Card = ({ children, onPress, variant = "default", padding = "medium", style }: CardProps) => {
  const colors = useColors();

  const paddingValues = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  };

  const baseStyle: ViewStyle = {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: paddingValues[padding],
  };

  const variantStyles: ViewStyle = (() => {
    switch (variant) {
      case "outlined":
        return {
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "elevated":
        return {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3, // Android shadow
        };
      case "default":
      default:
        return {};
    }
  })();

  const cardStyle: ViewStyle = {
    ...baseStyle,
    ...variantStyles,
    ...style,
  };

  // If onPress is provided, make it pressable
  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyle, pressed && { opacity: 0.7 }]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  // Otherwise, just a regular view
  return <View style={cardStyle}>{children}</View>;
};

export default Card;
