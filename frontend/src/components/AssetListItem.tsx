import { useColors } from "@/src/styles/globalColors";
import { Asset } from "@/src/types/asset";
import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import Card from "./Card";
import Icon from "./Icon";

interface AssetListItemProps {
  asset: Asset;
  onPress: () => void;
}

const AssetListItem = ({ asset, onPress }: AssetListItemProps) => {
  const colors = useColors();

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };

  const accentStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.brandLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
  };

  const nameStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textHeading,
    letterSpacing: -0.2,
  };

  const subtitleStyle: TextStyle = {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  };

  const metaStyle: ViewStyle = {
    alignItems: "flex-end",
    marginLeft: 8,
  };

  const usageStyle: TextStyle = {
    fontSize: 12,
    fontWeight: "500",
    color: colors.brandPrimary,
  };

  return (
    <Card variant="elevated" padding="medium" onPress={onPress}>
      <View style={rowStyle}>
        <View style={accentStyle}>
          <Icon
            name="build"
            iosName="wrench.fill"
            androidName="build"
            size={20}
            color={colors.brandPrimary}
          />
        </View>
        <View style={contentStyle}>
          <Text style={nameStyle}>{asset.name}</Text>
          <Text style={subtitleStyle}>
            {asset.brand} · {asset.model}
          </Text>
        </View>
        <View style={metaStyle}>
          {asset.totalUsageHours != null && (
            <Text style={usageStyle}>{asset.totalUsageHours}h</Text>
          )}
          <Icon
            name="chevron-right"
            iosName="chevron.right"
            androidName="chevron-right"
            size={16}
            color={colors.textMuted}
          />
        </View>
      </View>
    </Card>
  );
};

export default AssetListItem;
