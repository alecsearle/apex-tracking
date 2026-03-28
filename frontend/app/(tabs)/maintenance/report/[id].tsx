import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import ErrorMessage from "@/src/components/ErrorMessage";
import { useAuth } from "@/src/hooks/useAuth";
import { reportService } from "@/src/services/reportService";
import { useColors } from "@/src/styles/globalColors";
import { MaintenanceReport, ReportStatus } from "@/src/types/report";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

const STATUS_OPTIONS: { label: string; value: ReportStatus }[] = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

function StatusBadge({ status }: { status: ReportStatus }) {
  const colors = useColors();
  const config = {
    open: { text: "Open", color: colors.statusErrorText, bg: colors.statusErrorBg },
    in_progress: { text: "In Progress", color: colors.statusWarningText, bg: colors.statusWarningBg },
    resolved: { text: "Resolved", color: colors.statusActiveText, bg: colors.statusActiveBg },
  }[status];

  return (
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
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
    <View style={{ backgroundColor: config.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: config.color }}>{config.text}</Text>
    </View>
  );
}

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { businessId } = useAuth();
  const [report, setReport] = useState<MaintenanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getById(businessId, id);
      setReport(data);
    } catch (e: any) {
      setError(e.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [businessId, id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleStatusChange = (newStatus: ReportStatus) => {
    if (!businessId || !report || report.status === newStatus) return;

    const label = STATUS_OPTIONS.find((o) => o.value === newStatus)?.label ?? newStatus;
    Alert.alert(
      "Update Status",
      `Mark this report as "${label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            setUpdatingStatus(true);
            try {
              const updated = await reportService.update(businessId, report.id, { status: newStatus });
              setReport(updated);
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to update report status");
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ],
    );
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReport} />;
  if (!report) return <ErrorMessage message="Report not found" />;

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 32 };
  const detailRow: ViewStyle = {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  };
  const labelStyle: TextStyle = { fontSize: 15, color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 15, fontWeight: "600", color: colors.textPrimary };
  const sectionTitle: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginLeft: 4,
  };

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {/* Header */}
        <Card variant="elevated" padding="large">
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 12, backgroundColor: colors.statusWarningBg,
              justifyContent: "center", alignItems: "center", marginRight: 14,
            }}>
              <Icon name="report" iosName="exclamationmark.triangle.fill" androidName="report" size={24} color={colors.statusWarningText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.textHeading, letterSpacing: -0.3 }}>
                {report.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <StatusBadge status={report.status} />
                <SeverityBadge severity={report.severity} />
              </View>
            </View>
          </View>
        </Card>

        {/* Description */}
        {report.description && (
          <>
            <Text style={sectionTitle}>Description</Text>
            <Card variant="elevated" padding="medium">
              <Text style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 22 }}>
                {report.description}
              </Text>
            </Card>
          </>
        )}

        {/* Details */}
        <Text style={sectionTitle}>Details</Text>
        <Card variant="elevated" padding="none">
          <View style={{ paddingHorizontal: 16 }}>
            <View style={detailRow}>
              <Text style={labelStyle}>Asset</Text>
              <Text style={[valueStyle, { color: colors.brandPrimary }]}>{report.assetName}</Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Reported By</Text>
              <Text style={valueStyle}>{report.reportedByName}</Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Created</Text>
              <Text style={valueStyle}>{new Date(report.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={[detailRow, { borderBottomWidth: 0 }]}>
              <Text style={labelStyle}>Last Updated</Text>
              <Text style={valueStyle}>{new Date(report.updatedAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </Card>

        {/* Photos */}
        {report.photos.length > 0 && (
          <>
            <Text style={sectionTitle}>Photos ({report.photos.length})</Text>
            <View style={{ gap: 10 }}>
              {report.photos.map((photo) => (
                <Card key={photo.id} variant="elevated" padding="medium">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Icon name="photo" iosName="photo" androidName="photo" size={20} color={colors.brandPrimary} />
                    <Text style={{ fontSize: 14, color: colors.textPrimary, flex: 1 }}>
                      {photo.caption || "Photo"}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* Update Status */}
        {report.status !== "resolved" && (
          <>
            <Text style={sectionTitle}>Update Status</Text>
            <View style={{ gap: 10 }}>
              {report.status === "open" && (
                <Button
                  variant="primary"
                  fullWidth
                  icon="play-arrow"
                  iosIcon="play.fill"
                  androidIcon="play-arrow"
                  onPress={() => handleStatusChange("in_progress")}
                  disabled={updatingStatus}
                >
                  Mark In Progress
                </Button>
              )}
              <Button
                variant="primary"
                fullWidth
                icon="check-circle"
                iosIcon="checkmark.circle.fill"
                androidIcon="check-circle"
                onPress={() => handleStatusChange("resolved")}
                disabled={updatingStatus}
              >
                Mark as Resolved
              </Button>
            </View>
          </>
        )}

        {report.status === "resolved" && (
          <Card variant="elevated" padding="large">
            <View style={{ alignItems: "center", gap: 8 }}>
              <Icon name="check-circle" iosName="checkmark.circle.fill" androidName="check-circle" size={36} color={colors.statusActiveText} />
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textHeading }}>Report Resolved</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center" }}>
                This report was resolved on {new Date(report.updatedAt).toLocaleDateString()}.
              </Text>
            </View>
          </Card>
        )}

        {/* Reopen if resolved */}
        {report.status === "resolved" && (
          <Button
            variant="outline"
            fullWidth
            onPress={() => handleStatusChange("open")}
            disabled={updatingStatus}
          >
            Reopen Report
          </Button>
        )}
      </ScrollView>
    </View>
  );
}
