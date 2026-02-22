import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import ErrorMessage from "@/src/components/ErrorMessage";
import Icon from "@/src/components/Icon";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAsset } from "@/src/hooks/useAsset";
import { useMaintenanceSchedules } from "@/src/hooks/useMaintenanceSchedules";
import { useSOPs } from "@/src/hooks/useSOPs";
import { useSessions } from "@/src/hooks/useSessions";
import { useColors } from "@/src/styles/globalColors";
import { MaintenanceSchedule } from "@/src/types/maintenance";
import { Sop } from "@/src/types/sop";
import { UsageSession } from "@/src/types/session";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

function DueBadge({ status, info }: { status: MaintenanceSchedule["dueStatus"]; info: string }) {
  const colors = useColors();
  const config = {
    on_track: { color: colors.statusActiveText, bg: colors.statusActiveBg },
    due_soon: { color: colors.statusWarningText, bg: colors.statusWarningBg },
    overdue: { color: colors.statusErrorText, bg: colors.statusErrorBg },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{info}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const config = {
    available: { text: "Available", color: colors.statusActiveText, bg: colors.statusActiveBg },
    in_use: { text: "In Use", color: colors.statusActiveText, bg: colors.statusActiveBg },
    maintenance: { text: "Maintenance", color: colors.statusWarningText, bg: colors.statusWarningBg },
  }[status] ?? { text: status, color: colors.textSecondary, bg: colors.divider };

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

export default function AssetDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error, refetch } = useAsset(id);
  const { sessions } = useSessions(id);
  const { schedules } = useMaintenanceSchedules(id);
  const { sops } = useSOPs(id);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const activeSessions = sessions.filter((s) => s.status === "active");

  const handleDelete = () => {
    Alert.alert("Delete Asset", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => router.back() },
    ]);
  };

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const scrollContent: ViewStyle = { padding: 16, paddingBottom: 32 };
  const sectionTitle: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginTop: 24, marginBottom: 10, marginLeft: 4,
  };
  const detailRow: ViewStyle = {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  };
  const labelStyle: TextStyle = { fontSize: 15, color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 15, fontWeight: "600", color: colors.textPrimary };

  return (
    <ScrollView style={containerStyle} contentContainerStyle={scrollContent}>
      {/* Header */}
      <Card variant="elevated" padding="large">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 56, height: 56, borderRadius: 14, backgroundColor: colors.brandLight,
            justifyContent: "center", alignItems: "center", marginRight: 16,
          }}>
            <Icon name="build" iosName="wrench.fill" androidName="build" size={28} color={colors.brandPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textHeading, letterSpacing: -0.5 }}>
              {asset.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <Text style={{ fontSize: 15, color: colors.textSecondary }}>{asset.brand} · {asset.model}</Text>
              <StatusBadge status={asset.status} />
            </View>
          </View>
        </View>
      </Card>

      {/* Details */}
      <Text style={sectionTitle}>Details</Text>
      <Card variant="elevated" padding="none">
        <View style={{ paddingHorizontal: 16 }}>
          <View style={detailRow}>
            <Text style={labelStyle}>Serial Number</Text>
            <Text style={valueStyle}>{asset.serialNumber}</Text>
          </View>
          <View style={detailRow}>
            <Text style={labelStyle}>Purchase Date</Text>
            <Text style={valueStyle}>{asset.purchaseDate}</Text>
          </View>
          <View style={detailRow}>
            <Text style={labelStyle}>NFC Tag</Text>
            <Text style={[valueStyle, !asset.nfcTagId && { color: colors.textMuted }]}>
              {asset.nfcTagId || "Not assigned"}
            </Text>
          </View>
          <View style={[detailRow, { borderBottomWidth: 0 }]}>
            <Text style={labelStyle}>Total Usage</Text>
            <Text style={[valueStyle, { color: colors.brandPrimary }]}>{asset.totalUsageHours}h</Text>
          </View>
        </View>
      </Card>

      {/* Active Session */}
      {activeSessions.length > 0 && (
        <>
          <Text style={sectionTitle}>Active Session</Text>
          {activeSessions.map((session) => (
            <Card key={session.id} variant="elevated" padding="medium">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 10, height: 10, borderRadius: 5,
                  backgroundColor: colors.statusActiveText, marginRight: 12,
                }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
                    {session.startedByName}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                    Started {new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
                <Button variant="outline" onPress={() => Alert.alert("End Session", "This would end the session.")}>
                  End Session
                </Button>
              </View>
            </Card>
          ))}
        </>
      )}

      {/* Start Session (if available) */}
      {asset.status === "available" && (
        <>
          <Text style={sectionTitle}>Session</Text>
          <Button
            variant="primary"
            fullWidth
            icon="play-arrow"
            iosIcon="play.fill"
            androidIcon="play-arrow"
            onPress={() => Alert.alert("Start Session", "This would start a usage session.")}
          >
            Start Session
          </Button>
        </>
      )}

      {/* Maintenance Schedules */}
      <Text style={sectionTitle}>Maintenance Schedules</Text>
      {schedules.length > 0 ? (
        <View style={{ gap: 10 }}>
          {schedules.map((schedule) => (
            <Card
              key={schedule.id}
              variant="elevated"
              padding="medium"
              onPress={() => router.push(`/maintenance/${schedule.id}`)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
                    {schedule.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                    {schedule.triggerType === "usage_hours"
                      ? `Every ${schedule.intervalHours}h`
                      : `Every ${schedule.intervalDays} days`}
                  </Text>
                </View>
                <DueBadge status={schedule.dueStatus} info={schedule.dueInfo} />
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card variant="outlined" padding="large">
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>No maintenance schedules</Text>
          </View>
        </Card>
      )}

      {/* SOPs */}
      <Text style={sectionTitle}>SOPs</Text>
      {sops.length > 0 ? (
        <View style={{ gap: 10 }}>
          {sops.map((sop) => (
            <Card
              key={sop.id}
              variant="elevated"
              padding="medium"
              onPress={() => router.push(`/sops/${sop.id}`)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="menu-book" iosName="doc.text.fill" androidName="menu-book" size={20} color={colors.brandPrimary} />
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading, marginLeft: 10, flex: 1 }}>
                  {sop.title}
                </Text>
                <Icon name="chevron-right" iosName="chevron.right" androidName="chevron-right" size={16} color={colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card variant="outlined" padding="large">
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>No SOPs for this asset</Text>
          </View>
        </Card>
      )}

      {/* Maintenance Manual */}
      <Text style={sectionTitle}>Maintenance Manual</Text>
      <Card variant="elevated" padding="medium">
        {asset.manualUrl ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 10, backgroundColor: colors.statusActiveBg,
              justifyContent: "center", alignItems: "center",
            }}>
              <Icon name="description" iosName="doc.fill" androidName="description" size={22} color={colors.statusActiveText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>PDF Manual</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>Tap to view</Text>
            </View>
            <Icon name="open-in-new" iosName="arrow.up.right.square" androidName="open-in-new" size={20} color={colors.brandPrimary} />
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <Icon name="description" iosName="doc" androidName="description" size={28} color={colors.textMuted} />
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>No manual attached</Text>
          </View>
        )}
      </Card>

      {/* Actions */}
      <View style={{ marginTop: 28, gap: 10, alignItems: "center" }}>
        <Button
          variant="primary" fullWidth icon="edit" iosIcon="pencil" androidIcon="edit"
          onPress={() => router.push(`/assets/edit/${id}`)}
        >
          Edit Asset
        </Button>
        <Button variant="ghost" status="error" fullWidth onPress={handleDelete}>
          Delete Asset
        </Button>
      </View>
    </ScrollView>
  );
}
