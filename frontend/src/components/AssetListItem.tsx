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

function StatusBadge({ status }: { status: Asset["status"] }) {
  const colors = useColors();

  const config = {
    available: { text: "Available", color: colors.statusActiveText, bg: colors.statusActiveBg },
    in_use: { text: "In Use", color: colors.statusActiveText, bg: colors.statusActiveBg },
    maintenance: { text: "Maintenance", color: colors.statusWarningText, bg: colors.statusWarningBg },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

const AssetListItem = ({ asset, onPress }: AssetListItemProps) => {
  const colors = useColors();

  const rowStyle: ViewStyle = { flexDirection: "row", alignItems: "center" };
  const accentStyle: ViewStyle = {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.brandLight,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  };
  const contentStyle: ViewStyle = { flex: 1 };
  const nameStyle: TextStyle = { fontSize: 16, fontWeight: "600", color: colors.textHeading, letterSpacing: -0.2 };
  const subtitleStyle: TextStyle = { fontSize: 13, color: colors.textSecondary, marginTop: 2 };
  const metaStyle: ViewStyle = { alignItems: "flex-end", gap: 4, marginLeft: 8 };
  const usageStyle: TextStyle = { fontSize: 12, fontWeight: "500", color: colors.brandPrimary };

  return (
    <Card variant="elevated" padding="medium" onPress={onPress}>
      <View style={rowStyle}>
        <View style={accentStyle}>
          <Icon name="build" iosName="wrench.fill" androidName="build" size={20} color={colors.brandPrimary} />
        </View>
        <View style={contentStyle}>
          <Text style={nameStyle}>{asset.name}</Text>
          <Text style={subtitleStyle}>{asset.brand} · {asset.model}</Text>
        </View>
        <View style={metaStyle}>
          <StatusBadge status={asset.status} />
          <Text style={usageStyle}>{asset.totalUsageHours}h</Text>
        </View>
      </View>
    </Card>
  );
};

export default AssetListItem;
