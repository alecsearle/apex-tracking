import Card from "@/src/components/Card";
import FilterChips from "@/src/components/FilterChips";
import Icon from "@/src/components/Icon";
import SearchBar from "@/src/components/SearchBar";
import { useMaintenanceSchedules } from "@/src/hooks/useMaintenanceSchedules";
import { useReports } from "@/src/hooks/useReports";
import { useColors } from "@/src/styles/globalColors";
import { DueStatus, MaintenanceSchedule } from "@/src/types/maintenance";
import { MaintenanceReport, ReportStatus } from "@/src/types/report";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";
import { Stack } from "expo-router";

type TabView = "schedules" | "reports";

type DueFilter = "all" | DueStatus;

const filterOptions: { label: string; value: DueFilter }[] = [
  { label: "All", value: "all" },
  { label: "Overdue", value: "overdue" },
  { label: "Due Soon", value: "due_soon" },
  { label: "On Track", value: "on_track" },
];

type ReportFilter = "all" | ReportStatus;

const reportFilterOptions: { label: string; value: ReportFilter }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

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

function SeverityBadge({ severity }: { severity: MaintenanceReport["severity"] }) {
  const colors = useColors();
  const config = {
    low: { text: "Low", color: colors.statusActiveText, bg: colors.statusActiveBg },
    medium: { text: "Medium", color: colors.statusWarningText, bg: colors.statusWarningBg },
    high: { text: "High", color: colors.statusErrorText, bg: colors.statusErrorBg },
    critical: { text: "Critical", color: colors.statusErrorText, bg: colors.statusErrorBg },
  }[severity];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

function ReportStatusBadge({ status }: { status: MaintenanceReport["status"] }) {
  const colors = useColors();
  const config = {
    open: { text: "Open", color: colors.statusErrorText, bg: colors.statusErrorBg },
    in_progress: { text: "In Progress", color: colors.statusWarningText, bg: colors.statusWarningBg },
    resolved: { text: "Resolved", color: colors.statusActiveText, bg: colors.statusActiveBg },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

function ReportCard({ report, onPress }: { report: MaintenanceReport; onPress: () => void }) {
  const colors = useColors();

  return (
    <Card variant="elevated" padding="medium" onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
            {report.title}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {report.assetName} · {new Date(report.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <ReportStatusBadge status={report.status} />
          <SeverityBadge severity={report.severity} />
        </View>
      </View>
    </Card>
  );
}

function SegmentedControl({ selected, onSelect }: { selected: TabView; onSelect: (v: TabView) => void }) {
  const colors = useColors();

  const tabStyle = (active: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: active ? colors.brandPrimary : "transparent",
  });

  const tabText = (active: boolean): TextStyle => ({
    fontSize: 14,
    fontWeight: "600",
    color: active ? "#FFFFFF" : colors.textSecondary,
  });

  return (
    <View style={{
      flexDirection: "row",
      backgroundColor: colors.backgroundCard,
      borderRadius: 10,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      <Pressable style={tabStyle(selected === "schedules")} onPress={() => onSelect("schedules")}>
        <Text style={tabText(selected === "schedules")}>Schedules</Text>
      </Pressable>
      <Pressable style={tabStyle(selected === "reports")} onPress={() => onSelect("reports")}>
        <Text style={tabText(selected === "reports")}>Reports</Text>
      </Pressable>
    </View>
  );
}

export default function MaintenanceScreen() {
  const colors = useColors();
  const router = useRouter();
  const { schedules, overdue, dueSoon, onTrack, refetch } = useMaintenanceSchedules();
  const { reports, refetch: refetchReports } = useReports();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabView>("schedules");

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchReports();
    }, [refetch, refetchReports]),
  );
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");
  const [reportFilter, setReportFilter] = useState<ReportFilter>("all");

  const filteredSchedules = useMemo(() => {
    const query = search.toLowerCase().trim();
    return schedules.filter((s) => {
      if (dueFilter !== "all" && s.dueStatus !== dueFilter) return false;
      if (query) {
        const haystack = `${s.title} ${s.assetName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [schedules, search, dueFilter]);

  const filteredReports = useMemo(() => {
    const query = search.toLowerCase().trim();
    return reports.filter((r) => {
      if (reportFilter !== "all" && r.status !== reportFilter) return false;
      if (query) {
        const haystack = `${r.title} ${r.assetName} ${r.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [reports, search, reportFilter]);

  const openReports = reports.filter((r) => r.status !== "resolved");

  const sectionTitle = (text: string, color?: string): TextStyle => ({
    fontSize: 14, fontWeight: "700", color: color ?? colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginLeft: 4,
  });

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, paddingBottom: 32 };
  const sectionStyle: ViewStyle = { marginBottom: 24 };

  const hasIssues = overdue.length > 0 || dueSoon.length > 0;

  const navigateTo = (s: MaintenanceSchedule) => router.push(`/maintenance/${s.id}`);

  const isScheduleFiltering = search.trim().length > 0 || dueFilter !== "all";
  const isReportFiltering = search.trim().length > 0 || reportFilter !== "all";

  return (
    <View style={containerStyle}>
      <Stack.Screen
        options={{
          title: "Maintenance",
          headerRight: () => activeTab === "schedules" ? (
            <Pressable
              onPress={() => router.push("/maintenance/new")}
              hitSlop={8}
            >
              <Icon
                name="add"
                iosName="plus"
                androidName="add"
                size={22}
                color={colors.brandPrimary}
              />
            </Pressable>
          ) : undefined,
        }}
      />
      <ScrollView contentContainerStyle={contentStyle}>
        <View style={{ gap: 12, marginBottom: 16 }}>
          <SegmentedControl selected={activeTab} onSelect={setActiveTab} />
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={activeTab === "schedules" ? "Search schedules…" : "Search reports…"}
          />
          {activeTab === "schedules" ? (
            <FilterChips
              options={filterOptions}
              selected={dueFilter}
              onSelect={setDueFilter}
            />
          ) : (
            <FilterChips
              options={reportFilterOptions}
              selected={reportFilter}
              onSelect={setReportFilter}
            />
          )}
        </View>

        {activeTab === "schedules" ? (
          <>
            {isScheduleFiltering ? (
              <View style={{ gap: 10 }}>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((s) => (
                    <ScheduleCard key={s.id} schedule={s} onPress={() => navigateTo(s)} />
                  ))
                ) : (
                  <Card variant="outlined" padding="large">
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 14, color: colors.textSecondary }}>No schedules match your search</Text>
                    </View>
                  </Card>
                )}
              </View>
            ) : (
              <>
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
                        <ScheduleCard key={s.id} schedule={s} onPress={() => navigateTo(s)} />
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
                        <ScheduleCard key={s.id} schedule={s} onPress={() => navigateTo(s)} />
                      ))}
                    </View>
                  </View>
                )}

                <View style={sectionStyle}>
                  <Text style={sectionTitle("All Schedules")}>All Schedules ({onTrack.length + overdue.length + dueSoon.length})</Text>
                  <View style={{ gap: 10 }}>
                    {[...overdue, ...dueSoon, ...onTrack].map((s) => (
                      <ScheduleCard key={s.id} schedule={s} onPress={() => navigateTo(s)} />
                    ))}
                  </View>
                </View>
              </>
            )}
          </>
        ) : (
          /* Reports Tab */
          <>
            {isReportFiltering ? (
              <View style={{ gap: 10 }}>
                {filteredReports.length > 0 ? (
                  filteredReports.map((r) => (
                    <ReportCard key={r.id} report={r} onPress={() => router.push(`/maintenance/report/${r.id}`)} />
                  ))
                ) : (
                  <Card variant="outlined" padding="large">
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 14, color: colors.textSecondary }}>No reports match your search</Text>
                    </View>
                  </Card>
                )}
              </View>
            ) : (
              <>
                {openReports.length > 0 && (
                  <View style={sectionStyle}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10, marginLeft: 4 }}>
                      <Icon name="report" iosName="exclamationmark.triangle.fill" androidName="report" size={16} color={colors.statusErrorText} />
                      <Text style={sectionTitle("", colors.statusErrorText)}>Open Reports ({openReports.length})</Text>
                    </View>
                    <View style={{ gap: 10 }}>
                      {openReports.map((r) => (
                        <ReportCard key={r.id} report={r} onPress={() => router.push(`/maintenance/report/${r.id}`)} />
                      ))}
                    </View>
                  </View>
                )}

                {reports.length > 0 ? (
                  <View style={sectionStyle}>
                    <Text style={sectionTitle("All Reports")}>All Reports ({reports.length})</Text>
                    <View style={{ gap: 10 }}>
                      {reports.map((r) => (
                        <ReportCard key={r.id} report={r} onPress={() => router.push(`/maintenance/report/${r.id}`)} />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Card variant="elevated" padding="large">
                    <View style={{ alignItems: "center", gap: 8 }}>
                      <Icon name="check-circle" iosName="checkmark.circle.fill" androidName="check-circle" size={36} color={colors.statusActiveText} />
                      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textHeading }}>No reports filed</Text>
                      <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center" }}>
                        Reports created at the end of usage sessions will appear here.
                      </Text>
                    </View>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
