import AssetListItem from "@/src/components/AssetListItem";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useAssets } from "@/src/hooks/useAssets";
import { useColors } from "@/src/styles/globalColors";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function Index() {
  const colors = useColors();
  const router = useRouter();
  const { assets, refetch } = useAssets();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const recentAssets = assets.slice(0, 3);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  };

  const contentStyle: ViewStyle = {
    paddingHorizontal: 20,
    paddingBottom: 32,
  };

  const heroStyle: ViewStyle = {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 56,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  };

  const heroTitle: TextStyle = {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  };

  const heroSubtitle: TextStyle = {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  };

  const statsRow: ViewStyle = {
    flexDirection: "row",
    gap: 12,
    marginTop: -28,
    paddingHorizontal: 20,
    marginBottom: 24,
  };

  const statCard: ViewStyle = {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  };

  const statNumber: TextStyle = {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textHeading,
  };

  const statLabel: TextStyle = {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  };

  const sectionHeader: TextStyle = {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textHeading,
    marginBottom: 12,
  };

  const sectionStyle: ViewStyle = {
    marginBottom: 28,
  };

  const buttonRow: ViewStyle = {
    flexDirection: "row",
    gap: 12,
  };

  const recentListStyle: ViewStyle = {
    gap: 10,
  };

  return (
    <View style={containerStyle}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={heroStyle}>
          <Text style={heroTitle}>Apex Tracking</Text>
          <Text style={heroSubtitle}>Manage your equipment</Text>
        </View>

        <View style={statsRow}>
          <Card variant="elevated" padding="none" style={statCard}>
            <Text style={statNumber}>{assets.length}</Text>
            <Text style={statLabel}>Total Assets</Text>
          </Card>
          <Card variant="elevated" padding="none" style={statCard}>
            <Text style={statNumber}>{assets.filter((a) => a.totalUsageHours != null).length}</Text>
            <Text style={statLabel}>In Use</Text>
          </Card>
        </View>

        <View style={contentStyle}>
          <View style={sectionStyle}>
            <Text style={sectionHeader}>Quick Actions</Text>
            <View style={buttonRow}>
              <View style={{ flex: 1 }}>
                <Button
                  variant="primary"
                  fullWidth
                  icon="add"
                  iosIcon="plus"
                  androidIcon="add"
                  onPress={() => router.push("/assets/new")}
                >
                  Add Asset
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  variant="outline"
                  fullWidth
                  icon="list"
                  iosIcon="list.bullet"
                  androidIcon="list"
                  onPress={() => router.push("/assets")}
                >
                  View All
                </Button>
              </View>
            </View>
          </View>

          {recentAssets.length > 0 && (
            <View style={sectionStyle}>
              <Text style={sectionHeader}>Recent Assets</Text>
              <View style={recentListStyle}>
                {recentAssets.map((asset) => (
                  <AssetListItem
                    key={asset.id}
                    asset={asset}
                    onPress={() => router.push(`/assets/${asset.id}`)}
                  />
                ))}
              </View>
            </View>
          )}

          {recentAssets.length === 0 && (
            <Card variant="outlined" padding="large">
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                <Icon
                  name="build"
                  iosName="wrench.fill"
                  androidName="build"
                  size={36}
                  color={colors.textMuted}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.textSecondary,
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  No assets yet. Add your first piece of equipment to get started.
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
