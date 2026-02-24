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
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

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

function formatDuration(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const mins = Math.round((end - start) / (1000 * 60));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export default function AssetDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error, refetch: refetchAsset, deleteAsset } = useAsset(id);
  const { sessions, refetch: refetchSessions, startSession, endSession } = useSessions(id);
  const { schedules } = useMaintenanceSchedules(id);
  const { sops } = useSOPs(id);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetchAsset();
      refetchSessions();
    }, [refetchAsset, refetchSessions]),
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={refetchAsset} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const activeSessions = sessions.filter((s) => s.status === "active");
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime());

  const handleStartSession = () => {
    Alert.alert("Start Session", `Start a usage session for ${asset.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start",
        onPress: () => {
          startSession(asset.id, asset.name);
          refetchAsset();
        },
      },
    ]);
  };

  const handleEndSession = (sessionId: string) => {
    Alert.alert("End Session", "Are you sure you want to end this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Session",
        style: "destructive",
        onPress: () => {
          endSession(sessionId);
          refetchAsset();
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Asset", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteAsset();
          router.back();
        },
      },
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

      {/* Session */}
      <Text style={sectionTitle}>Session</Text>
      {activeSessions.map((session) => (
        <Card key={session.id} variant="elevated" padding="medium" style={{ marginBottom: 10 }}>
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
            <Button variant="outline" onPress={() => handleEndSession(session.id)}>
              End Session
            </Button>
          </View>
        </Card>
      ))}
      {asset.status === "available" && (
        <Button
          variant="primary"
          fullWidth
          icon="play-arrow"
          iosIcon="play.fill"
          androidIcon="play-arrow"
          onPress={handleStartSession}
        >
          Start Session
        </Button>
      )}
      {completedSessions.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Pressable
            onPress={() => setHistoryExpanded((prev) => !prev)}
            style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              paddingVertical: 12, paddingHorizontal: 16,
              backgroundColor: colors.backgroundCard,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>
              Session History ({completedSessions.length})
            </Text>
            <Icon
              name={historyExpanded ? "expand-less" : "expand-more"}
              iosName={historyExpanded ? "chevron.up" : "chevron.down"}
              androidName={historyExpanded ? "expand-less" : "expand-more"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
          {historyExpanded && (
            <Card variant="elevated" padding="none" style={{ marginTop: 8 }}>
              <View style={{ paddingHorizontal: 16 }}>
                {completedSessions.map((session, index) => (
                  <View
                    key={session.id}
                    style={[
                      detailRow,
                      index === completedSessions.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
                        {session.startedByName}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                        {new Date(session.startedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.brandPrimary }}>
                      {formatDuration(session.startedAt, session.endedAt)}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </View>
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
              onPress={() => router.push(`/assets/maintenance/${schedule.id}`)}
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
              onPress={() => router.push(`/assets/sop/${sop.id}`)}
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
      <Card variant="elevated" padding="medium" onPress={asset.manualUrl ? () => router.push(`/assets/manual/${id}`) : undefined}>
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
            <Icon name="chevron-right" iosName="chevron.right" androidName="chevron-right" size={20} color={colors.brandPrimary} />
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
