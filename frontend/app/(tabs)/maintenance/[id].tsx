import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useAuth } from "@/src/hooks/useAuth";
import { useMaintenanceLogs } from "@/src/hooks/useMaintenanceLogs";
import { useMaintenanceSchedule } from "@/src/hooks/useMaintenanceSchedule";
import { useColors } from "@/src/styles/globalColors";
import { MaintenanceLog, MaintenanceSchedule } from "@/src/types/maintenance";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

function DueBadge({ status, info }: { status: MaintenanceSchedule["dueStatus"]; info: string }) {
  const colors = useColors();
  const config = {
    on_track: { color: colors.statusActiveText, bg: colors.statusActiveBg },
    due_soon: { color: colors.statusWarningText, bg: colors.statusWarningBg },
    overdue: { color: colors.statusErrorText, bg: colors.statusErrorBg },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: config.color }}>{info}</Text>
    </View>
  );
}

const INITIAL_LOG_COUNT = 3;

function CompletionHistory({ logs, colors }: { logs: MaintenanceLog[]; colors: ReturnType<typeof useColors> }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = logs.length > INITIAL_LOG_COUNT;
  const visibleLogs = expanded ? logs : logs.slice(0, INITIAL_LOG_COUNT);

  const sectionTitle: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginLeft: 4,
  };

  return (
    <>
      <Text style={sectionTitle}>Completion History ({logs.length})</Text>
      {logs.length > 0 ? (
        <View style={{ gap: 10 }}>
          {visibleLogs.map((log) => (
            <Card key={log.id} variant="elevated" padding="medium">
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 18, backgroundColor: colors.statusActiveBg,
                  justifyContent: "center", alignItems: "center", marginRight: 12,
                }}>
                  <Icon name="check" iosName="checkmark" androidName="check" size={18} color={colors.statusActiveText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
                    {log.completedByName}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                    {new Date(log.completedAt).toLocaleDateString()} ·{" "}
                    {log.usageHoursAtCompletion != null ? `${log.usageHoursAtCompletion}h` : "Time-based"}
                  </Text>
                  {log.notes && (
                    <Text style={{ fontSize: 14, color: colors.textPrimary, marginTop: 6, lineHeight: 20 }}>
                      {log.notes}
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          ))}
          {hasMore && (
            <Pressable
              onPress={() => setExpanded(!expanded)}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, gap: 6 }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.brandPrimary }}>
                {expanded ? "Show Less" : `View ${logs.length - INITIAL_LOG_COUNT} More`}
              </Text>
              <Icon
                name={expanded ? "expand-less" : "expand-more"}
                iosName={expanded ? "chevron.up" : "chevron.down"}
                androidName={expanded ? "expand-less" : "expand-more"}
                size={18}
                color={colors.brandPrimary}
              />
            </Pressable>
          )}
        </View>
      ) : (
        <Card variant="outlined" padding="large">
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>No completions logged yet.</Text>
          </View>
        </Card>
      )}
    </>
  );
}

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { session, role } = useAuth();
  const { schedule, loading: scheduleLoading, deleteSchedule } = useMaintenanceSchedule(id);
  const { logs } = useMaintenanceLogs(id);

  const canModify = role === "owner" || (session?.user?.id && schedule?.createdBy === session.user.id);

  function handleDelete() {
    Alert.alert("Delete Schedule", `Are you sure you want to delete "${schedule?.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteSchedule();
          router.back();
        },
      },
    ]);
  }

  if (scheduleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  if (!schedule) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Schedule not found</Text>
      </View>
    );
  }

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 32 };
  const detailRow: ViewStyle = {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  };
  const labelStyle: TextStyle = { fontSize: 15, color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 15, fontWeight: "600", color: colors.textPrimary };

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {/* Schedule Info */}
        <Card variant="elevated" padding="large">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textHeading, flex: 1 }}>
              {schedule.title}
            </Text>
            <DueBadge status={schedule.dueStatus} info={schedule.dueInfo} />
          </View>
          {schedule.description && (
            <Text style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 22, marginBottom: 12 }}>
              {schedule.description}
            </Text>
          )}
          <View style={{ paddingTop: 4 }}>
            <View style={detailRow}>
              <Text style={labelStyle}>Asset</Text>
              <Text style={[valueStyle, { color: colors.brandPrimary }]}>{schedule.assetName}</Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Trigger</Text>
              <Text style={valueStyle}>
                {schedule.triggerType === "usage_hours"
                  ? `Every ${schedule.intervalHours} hours`
                  : `Every ${schedule.intervalDays} days`}
              </Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Created By</Text>
              <Text style={valueStyle}>{schedule.createdByName}</Text>
            </View>
            <View style={[detailRow, { borderBottomWidth: 0 }]}>
              <Text style={labelStyle}>Last Completed</Text>
              <Text style={valueStyle}>
                {schedule.lastCompletedAt
                  ? new Date(schedule.lastCompletedAt).toLocaleDateString()
                  : "Never"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Complete Button */}
        <Button
          variant="primary"
          fullWidth
          icon="check-circle"
          iosIcon="checkmark.circle.fill"
          androidIcon="check-circle"
          onPress={() => router.push(`/maintenance/complete/${id}`)}
        >
          Complete Maintenance
        </Button>

        {/* Completion History */}
        <CompletionHistory logs={logs} colors={colors} />

        {/* Edit / Delete */}
        {canModify && (
          <View style={{ gap: 12 }}>
            <Button
              variant="outline"
              fullWidth
              icon="edit"
              iosIcon="pencil"
              androidIcon="edit"
              onPress={() => router.push(`/maintenance/edit/${id}`)}
            >
              Edit Schedule
            </Button>
            <Button
              variant="danger"
              fullWidth
              icon="delete"
              iosIcon="trash"
              androidIcon="delete"
              onPress={handleDelete}
            >
              Delete Schedule
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
