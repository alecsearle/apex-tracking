import Icon from "@/src/components/Icon";
import { useColors } from "@/src/styles/globalColors";
import React from "react";
import {
  Pressable,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search…",
}: SearchBarProps) {
  const colors = useColors();

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 8,
    paddingVertical: 0,
  };

  return (
    <View style={containerStyle}>
      <Icon
        name="search"
        iosName="magnifyingglass"
        androidName="search"
        size={18}
        color={colors.textSecondary}
      />
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Icon
            name="cancel"
            iosName="xmark.circle.fill"
            androidName="cancel"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}
