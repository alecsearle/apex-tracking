import { useColors } from "@/src/styles/globalColors";
import { ReportSeverity } from "@/src/types/report";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Button from "./Button";
import Icon from "./Icon";

interface EndSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: {
    notes?: string;
    jobSiteName?: string;
    report?: { title: string; description: string; severity: ReportSeverity };
  }) => void;
  operatorName: string;
  sessionStartedAt: string;
  sessionTotalPausedMs?: number;
}

const SEVERITY_OPTIONS: { value: ReportSeverity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

function formatElapsed(startedAt: string, totalPausedMs?: number): string {
  const elapsed = Date.now() - new Date(startedAt).getTime() - (totalPausedMs ?? 0);
  const mins = Math.max(0, Math.round(elapsed / (1000 * 60)));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export default function EndSessionModal({
  visible,
  onClose,
  onComplete,
  operatorName,
  sessionStartedAt,
  sessionTotalPausedMs,
}: EndSessionModalProps) {
  const colors = useColors();

  const [jobSiteName, setJobSiteName] = useState("");
  const [notes, setNotes] = useState("");
  const [reportExpanded, setReportExpanded] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSeverity, setReportSeverity] = useState<ReportSeverity>("medium");
  const [validationError, setValidationError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setJobSiteName("");
      setNotes("");
      setReportExpanded(false);
      setReportTitle("");
      setReportDescription("");
      setReportSeverity("medium");
      setValidationError("");
    }
  }, [visible]);

  const handleComplete = () => {
    if (reportExpanded) {
      if (!reportTitle.trim()) {
        setValidationError("Report title is required");
        return;
      }
      if (!reportDescription.trim()) {
        setValidationError("Report description is required");
        return;
      }
    }
    setValidationError("");

    onComplete({
      notes: notes.trim() || undefined,
      jobSiteName: jobSiteName.trim() || undefined,
      report: reportExpanded
        ? {
            title: reportTitle.trim(),
            description: reportDescription.trim(),
            severity: reportSeverity,
          }
        : undefined,
    });
  };

  const severityColor = (severity: ReportSeverity): { text: string; bg: string } => {
    switch (severity) {
      case "low":
        return { text: colors.statusActiveText, bg: colors.statusActiveBg };
      case "medium":
        return { text: colors.statusWarningText, bg: colors.statusWarningBg };
      case "high":
        return { text: colors.statusErrorText, bg: colors.statusErrorBg };
      case "critical":
        return { text: "#FFFFFF", bg: colors.statusErrorText };
    }
  };

  const inputStyle: TextStyle = {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.textPrimary,
  };

  const labelStyle: TextStyle = {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 16,
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" } as ViewStyle}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.backgroundPrimary,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "90%",
            } as ViewStyle}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.textHeading }}>
                  End Session
                </Text>
                <Pressable onPress={onClose} hitSlop={12}>
                  <Icon
                    name="close"
                    iosName="xmark"
                    androidName="close"
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Session info */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  backgroundColor: colors.backgroundCard,
                  borderRadius: 10,
                }}
              >
                <Icon
                  name="person"
                  iosName="person.fill"
                  androidName="person"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={{ fontSize: 14, color: colors.textPrimary, marginLeft: 8, flex: 1 }}>
                  {operatorName}
                </Text>
                <Icon
                  name="schedule"
                  iosName="clock.fill"
                  androidName="schedule"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.brandPrimary, marginLeft: 6 }}>
                  {formatElapsed(sessionStartedAt, sessionTotalPausedMs)}
                </Text>
              </View>

              {/* Job Site */}
              <Text style={labelStyle}>Job Site (optional)</Text>
              <TextInput
                style={inputStyle}
                placeholder="e.g. Henderson Property"
                placeholderTextColor={colors.textMuted}
                value={jobSiteName}
                onChangeText={setJobSiteName}
                maxLength={100}
              />

              {/* Notes */}
              <Text style={labelStyle}>Notes (optional)</Text>
              <TextInput
                style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
                placeholder="Any notes about this session..."
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                maxLength={500}
              />

              {/* Report Section */}
              <Pressable
                onPress={() => {
                  setReportExpanded((prev) => !prev);
                  setValidationError("");
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  backgroundColor: colors.statusWarningBg,
                  borderRadius: 10,
                }}
              >
                <Icon
                  name="warning"
                  iosName="exclamationmark.triangle.fill"
                  androidName="warning"
                  size={18}
                  color={colors.statusWarningText}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.statusWarningText,
                    marginLeft: 10,
                    flex: 1,
                  }}
                >
                  Report Damage / Repair
                </Text>
                <Icon
                  name={reportExpanded ? "expand-less" : "expand-more"}
                  iosName={reportExpanded ? "chevron.up" : "chevron.down"}
                  androidName={reportExpanded ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.statusWarningText}
                />
              </Pressable>

              {reportExpanded && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[labelStyle, { marginTop: 0 }]}>Report Title *</Text>
                  <TextInput
                    style={inputStyle}
                    placeholder="e.g. Chain guard cracked"
                    placeholderTextColor={colors.textMuted}
                    value={reportTitle}
                    onChangeText={(text) => {
                      setReportTitle(text);
                      setValidationError("");
                    }}
                    maxLength={100}
                  />

                  <Text style={labelStyle}>Description *</Text>
                  <TextInput
                    style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
                    placeholder="Describe the issue..."
                    placeholderTextColor={colors.textMuted}
                    value={reportDescription}
                    onChangeText={(text) => {
                      setReportDescription(text);
                      setValidationError("");
                    }}
                    multiline
                    maxLength={500}
                  />

                  <Text style={labelStyle}>Severity</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {SEVERITY_OPTIONS.map((option) => {
                      const isSelected = reportSeverity === option.value;
                      const chipColor = severityColor(option.value);
                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => setReportSeverity(option.value)}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                            backgroundColor: isSelected ? chipColor.bg : colors.backgroundCard,
                            borderWidth: 1,
                            borderColor: isSelected ? chipColor.text : colors.divider,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: isSelected ? chipColor.text : colors.textSecondary,
                            }}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Validation Error */}
              {validationError ? (
                <Text style={{ fontSize: 13, color: colors.statusErrorText, marginTop: 12 }}>
                  {validationError}
                </Text>
              ) : null}

              {/* Complete Button */}
              <View style={{ marginTop: 24 }}>
                <Button variant="primary" fullWidth onPress={handleComplete}>
                  Complete Session
                </Button>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
