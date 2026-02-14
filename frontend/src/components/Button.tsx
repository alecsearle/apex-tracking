import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "./Icon";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  alignment?: "left" | "center" | "right";
  status?: "active" | "warning" | "error";
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  halfWidth?: boolean;
  icon?: string;
  iosIcon?: string;
  androidIcon?: string;
}

const Button = ({
  variant = "primary",
  alignment = "center",
  status,
  onPress,
  children,
  disabled = false,
  fullWidth = false,
  halfWidth = false,
  icon,
  iosIcon,
  androidIcon,
}: ButtonProps) => {
  const colors = useColors();

  // Determine button colors based on variant and status
  const getButtonColors = (): { bg: string; text: string; border?: string } => {
    if (disabled) {
      return {
        bg: colors.divider,
        text: colors.textMuted,
      };
    }

    // Status buttons (for tool actions)
    if (status) {
      switch (status) {
        case "active":
          return { bg: colors.statusActiveBg, text: colors.statusActiveText };
        case "warning":
          return { bg: colors.statusWarningBg, text: colors.statusWarningText };
        case "error":
          return { bg: colors.statusErrorBg, text: colors.statusErrorText };
      }
    }

    // Regular variant buttons
    switch (variant) {
      case "primary":
        return { bg: colors.brandPrimary, text: "#FFFFFF" };
      case "secondary":
        return { bg: colors.divider, text: colors.textPrimary };
      case "outline":
        return {
          bg: "transparent",
          text: colors.brandPrimary,
          border: colors.brandPrimary,
        };
      case "ghost":
        return { bg: "transparent", text: colors.brandPrimary };
      default:
        return { bg: colors.brandPrimary, text: "#FFFFFF" };
    }
  };

  const getButtonAlignment = (): "flex-start" | "center" | "flex-end" => {
    switch (alignment) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      case "center":
      default:
        return "center";
    }
  };

  const buttonColors = getButtonColors();
  const buttonAlignment = getButtonAlignment();

  const buttonStyle: ViewStyle = {
    backgroundColor: buttonColors.bg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: buttonAlignment,
    flexDirection: "row",
    gap: 8,
    ...(fullWidth && { width: "100%" }),
    ...(halfWidth && { width: "45%" }),
    ...(buttonColors.border && {
      borderWidth: 2,
      borderColor: buttonColors.border,
    }),
    ...(disabled && { opacity: 0.5 }),
  };

  const textStyle: TextStyle = {
    color: buttonColors.text,
    fontSize: 16,
    fontWeight: "600",
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      {icon && (
        <Icon
          name={icon}
          iosName={iosIcon}
          androidName={androidIcon}
          size={20}
          color={buttonColors.text}
        />
      )}
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
