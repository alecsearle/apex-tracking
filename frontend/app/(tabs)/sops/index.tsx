import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useSOPs } from "@/src/hooks/useSOPs";
import { useColors } from "@/src/styles/globalColors";
import { Sop } from "@/src/types/sop";
import { useRouter } from "expo-router";
import { ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

function SourceBadge({ source }: { source: Sop["source"] }) {
  const colors = useColors();
  const config = {
    manual: { text: "Manual", color: colors.brandPrimary, bg: colors.brandLight },
    custom: { text: "Custom", color: colors.textSecondary, bg: colors.divider },
  }[source];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

function SOPCard({ sop, onPress }: { sop: Sop; onPress: () => void }) {
  const colors = useColors();

  return (
    <Card variant="elevated" padding="medium" onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{
          width: 40, height: 40, borderRadius: 10, backgroundColor: colors.brandLight,
          justifyContent: "center", alignItems: "center", marginRight: 12,
        }}>
          <Icon name="menu-book" iosName="doc.text.fill" androidName="menu-book" size={20} color={colors.brandPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>{sop.title}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {sop.assetName ?? "All Assets"} · {sop.createdByName}
          </Text>
        </View>
        <SourceBadge source={sop.source} />
      </View>
    </Card>
  );
}

export default function SOPsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { sops } = useSOPs();

  const businessWide = sops.filter((s) => !s.assetId);
  const perAsset = sops.filter((s) => !!s.assetId);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, paddingBottom: 32 };
  const sectionTitle: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginLeft: 4,
  };
  const sectionStyle: ViewStyle = { marginBottom: 24 };

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {businessWide.length > 0 && (
          <View style={sectionStyle}>
            <Text style={sectionTitle}>Business-Wide</Text>
            <View style={{ gap: 10 }}>
              {businessWide.map((sop) => (
                <SOPCard key={sop.id} sop={sop} onPress={() => router.push(`/sops/${sop.id}`)} />
              ))}
            </View>
          </View>
        )}

        {perAsset.length > 0 && (
          <View style={sectionStyle}>
            <Text style={sectionTitle}>Per Asset</Text>
            <View style={{ gap: 10 }}>
              {perAsset.map((sop) => (
                <SOPCard key={sop.id} sop={sop} onPress={() => router.push(`/sops/${sop.id}`)} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
