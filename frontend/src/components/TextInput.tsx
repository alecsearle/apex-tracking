import { useColors } from "@/src/styles/globalColors";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  keyboardType,
}: TextInputProps) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: 20,
  };

  const labelStyle: TextStyle = {
    fontSize: 13,
    fontWeight: "600",
    color: focused ? colors.brandPrimary : colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  };

  const borderColor = error
    ? colors.statusErrorText
    : focused
      ? colors.brandPrimary
      : colors.border;

  const inputStyle: TextStyle = {
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...(multiline && { minHeight: 80, textAlignVertical: "top" }),
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: colors.statusErrorText,
    marginTop: 6,
    fontWeight: "500",
  };

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <RNTextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default TextInput;
