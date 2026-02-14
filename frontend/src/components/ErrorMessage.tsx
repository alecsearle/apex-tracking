import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import Button from "./Button";
import Icon from "./Icon";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
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
    backgroundColor: colors.statusErrorBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  };

  const titleStyle: TextStyle = {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textHeading,
    marginBottom: 8,
  };

  const textStyle: TextStyle = {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  };

  return (
    <View style={containerStyle}>
      <View style={iconContainer}>
        <Icon
          name="error-outline"
          iosName="exclamationmark.triangle"
          androidName="error-outline"
          size={32}
          color={colors.statusErrorText}
        />
      </View>
      <Text style={titleStyle}>Something went wrong</Text>
      <Text style={textStyle}>{message}</Text>
      {onRetry && (
        <Button variant="outline" onPress={onRetry}>
          Try Again
        </Button>
      )}
    </View>
  );
};

export default ErrorMessage;
