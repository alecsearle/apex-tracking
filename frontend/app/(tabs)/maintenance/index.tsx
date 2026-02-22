import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useMaintenanceSchedules } from "@/src/hooks/useMaintenanceSchedules";
import { useColors } from "@/src/styles/globalColors";
import { MaintenanceSchedule } from "@/src/types/maintenance";
import { useRouter } from "expo-router";
import { ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

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

function ScheduleCard({ schedule, onPress }: { schedule: MaintenanceSchedule; onPress: () => void }) {
  const colors = useColors();

  return (
    <Card variant="elevated" padding="medium" onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
            {schedule.title}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {schedule.assetName} · {schedule.triggerType === "usage_hours"
              ? `Every ${schedule.intervalHours}h`
              : `Every ${schedule.intervalDays} days`}
          </Text>
        </View>
        <DueBadge status={schedule.dueStatus} info={schedule.dueInfo} />
      </View>
    </Card>
  );
}

export default function MaintenanceScreen() {
  const colors = useColors();
  const router = useRouter();
  const { overdue, dueSoon, onTrack } = useMaintenanceSchedules();

  const sectionTitle = (text: string, color?: string): TextStyle => ({
    fontSize: 14, fontWeight: "700", color: color ?? colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginLeft: 4,
  });

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, paddingBottom: 32 };
  const sectionStyle: ViewStyle = { marginBottom: 24 };

  const hasIssues = overdue.length > 0 || dueSoon.length > 0;

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {!hasIssues && (
          <Card variant="elevated" padding="large" style={{ marginBottom: 24 }}>
            <View style={{ alignItems: "center", gap: 8 }}>
              <Icon name="check-circle" iosName="checkmark.circle.fill" androidName="check-circle" size={36} color={colors.statusActiveText} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textHeading }}>All maintenance is on track</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center" }}>
                No overdue or upcoming maintenance tasks.
              </Text>
            </View>
          </Card>
        )}

        {overdue.length > 0 && (
          <View style={sectionStyle}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10, marginLeft: 4 }}>
              <Icon name="error" iosName="exclamationmark.triangle.fill" androidName="error" size={16} color={colors.statusErrorText} />
              <Text style={sectionTitle("", colors.statusErrorText)}>Overdue ({overdue.length})</Text>
            </View>
            <View style={{ gap: 10 }}>
              {overdue.map((s) => (
                <ScheduleCard key={s.id} schedule={s} onPress={() => router.push(`/maintenance/${s.id}`)} />
              ))}
            </View>
          </View>
        )}

        {dueSoon.length > 0 && (
          <View style={sectionStyle}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10, marginLeft: 4 }}>
              <Icon name="warning" iosName="exclamationmark.circle.fill" androidName="warning" size={16} color={colors.statusWarningText} />
              <Text style={sectionTitle("", colors.statusWarningText)}>Due Soon ({dueSoon.length})</Text>
            </View>
            <View style={{ gap: 10 }}>
              {dueSoon.map((s) => (
                <ScheduleCard key={s.id} schedule={s} onPress={() => router.push(`/maintenance/${s.id}`)} />
              ))}
            </View>
          </View>
        )}

        <View style={sectionStyle}>
          <Text style={sectionTitle("All Schedules")}>All Schedules ({onTrack.length + overdue.length + dueSoon.length})</Text>
          <View style={{ gap: 10 }}>
            {[...overdue, ...dueSoon, ...onTrack].map((s) => (
              <ScheduleCard key={s.id} schedule={s} onPress={() => router.push(`/maintenance/${s.id}`)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
