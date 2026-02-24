import { useColors } from "@/src/styles/globalColors";
import React from "react";
import { Pressable, ScrollView, Text, TextStyle, ViewStyle } from "react-native";

interface FilterChipsProps<T extends string> {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (value: T) => void;
}

export default function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={scrollContentStyle}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;

        const chipStyle: ViewStyle = {
          paddingHorizontal: 14,
          paddingVertical: 7,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isSelected ? colors.brandPrimary : colors.border,
          backgroundColor: isSelected ? colors.brandPrimary : colors.backgroundCard,
        };

        const labelStyle: TextStyle = {
          fontSize: 13,
          fontWeight: "600",
          color: isSelected ? "#FFFFFF" : colors.textSecondary,
        };

        return (
          <Pressable key={option.value} style={chipStyle} onPress={() => onSelect(option.value)}>
            <Text style={labelStyle}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const scrollContentStyle: ViewStyle = {
  gap: 8,
};
