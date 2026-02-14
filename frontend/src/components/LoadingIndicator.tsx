import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { ActivityIndicator, Text, TextStyle, View, ViewStyle } from "react-native";

const LoadingIndicator = () => {
  const colors = useColors();

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  };

  const textStyle: TextStyle = {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 14,
    fontWeight: "500",
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator size="large" color={colors.brandPrimary} />
      <Text style={textStyle}>Loading...</Text>
    </View>
  );
};

export default LoadingIndicator;
