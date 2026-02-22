import AssetListItem from "@/src/components/AssetListItem";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useAssets } from "@/src/hooks/useAssets";
import { useSessions } from "@/src/hooks/useSessions";
import { CURRENT_USER, getMaintenanceDueCount, MOCK_BUSINESS } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { UsageSession } from "@/src/types/session";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Animated, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

function formatDuration(startedAt: string): string {
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  const diffMs = now - start;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function SessionCard({ session }: { session: UsageSession }) {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  const cardRow: ViewStyle = { flexDirection: "row", alignItems: "center" };
  const dot: ViewStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.statusActiveText,
    marginRight: 12,
  };
  const info: ViewStyle = { flex: 1 };

  return (
    <Card variant="elevated" padding="medium">
      <View style={cardRow}>
        <Animated.View style={[dot, { opacity: pulseAnim }]} />
        <View style={info}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textHeading }}>
            {session.assetName}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {session.startedByName} · {formatDuration(session.startedAt)}
          </Text>
        </View>
        <View style={{ backgroundColor: colors.statusActiveBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.statusActiveText }}>Active</Text>
        </View>
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { assets } = useAssets();
  const { sessions } = useSessions();

  const inUseCount = assets.filter((a) => a.status === "in_use").length;
  const maintenanceDueCount = getMaintenanceDueCount();
  const recentAssets = assets.slice(0, 3);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const heroStyle: ViewStyle = {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 56,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  };
  const heroTitle: TextStyle = { fontSize: 28, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5 };
  const heroSubtitle: TextStyle = { fontSize: 15, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 };
  const statsRow: ViewStyle = { flexDirection: "row", gap: 12, marginTop: -28, paddingHorizontal: 20, marginBottom: 24 };
  const statCard: ViewStyle = { flex: 1, alignItems: "center", paddingVertical: 16 };
  const statNumber: TextStyle = { fontSize: 24, fontWeight: "700", color: colors.textHeading };
  const statLabel: TextStyle = { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: "500" };
  const contentStyle: ViewStyle = { paddingHorizontal: 20, paddingBottom: 32 };
  const sectionHeader: TextStyle = { fontSize: 18, fontWeight: "700", color: colors.textHeading, marginBottom: 12 };
  const sectionStyle: ViewStyle = { marginBottom: 28 };
  const buttonRow: ViewStyle = { flexDirection: "row", gap: 12 };

  return (
    <View style={containerStyle}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={heroStyle}>
          <Text style={heroTitle}>{MOCK_BUSINESS.name}</Text>
          <Text style={heroSubtitle}>Welcome back, {CURRENT_USER.fullName.split(" ")[0]}</Text>
        </View>

        <View style={statsRow}>
          <Card variant="elevated" padding="none" style={statCard}>
            <Text style={statNumber}>{assets.length}</Text>
            <Text style={statLabel}>Total Assets</Text>
          </Card>
          <Card variant="elevated" padding="none" style={statCard}>
            <Text style={[statNumber, inUseCount > 0 && { color: colors.statusActiveText }]}>{inUseCount}</Text>
            <Text style={statLabel}>In Use</Text>
          </Card>
          <Card variant="elevated" padding="none" style={statCard}>
            <Text style={[statNumber, maintenanceDueCount > 0 && { color: colors.statusWarningText }]}>{maintenanceDueCount}</Text>
            <Text style={statLabel}>Maint. Due</Text>
          </Card>
        </View>

        <View style={contentStyle}>
          {sessions.length > 0 && (
            <View style={sectionStyle}>
              <Text style={sectionHeader}>Active Sessions</Text>
              <View style={{ gap: 10 }}>
                {sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </View>
            </View>
          )}

          {sessions.length === 0 && (
            <View style={sectionStyle}>
              <Text style={sectionHeader}>Active Sessions</Text>
              <Card variant="outlined" padding="large">
                <View style={{ alignItems: "center", paddingVertical: 8 }}>
                  <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: "center" }}>
                    No active sessions
                  </Text>
                </View>
              </Card>
            </View>
          )}

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
              <View style={{ gap: 10 }}>
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
        </View>
      </ScrollView>
    </View>
  );
}
