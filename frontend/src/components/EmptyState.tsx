import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import Button from "./Button";
import Icon from "./Icon";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ message, actionLabel, onAction }: EmptyStateProps) => {
  const colors = useColors();

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
    padding: 32,
  };

  const iconContainer: ViewStyle = {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.brandLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  };

  const textStyle: TextStyle = {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  };

  return (
    <View style={containerStyle}>
      <View style={iconContainer}>
        <Icon
          name="inbox"
          iosName="tray"
          androidName="inbox"
          size={32}
          color={colors.brandPrimary}
        />
      </View>
      <Text style={textStyle}>{message}</Text>
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
