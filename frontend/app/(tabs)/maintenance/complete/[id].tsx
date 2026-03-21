import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import TextInput from "@/src/components/TextInput";
import { useMaintenanceSchedule } from "@/src/hooks/useMaintenanceSchedule";
import { maintenanceService } from "@/src/services/maintenanceService";
import { useAuth } from "@/src/hooks/useAuth";
import { useColors } from "@/src/styles/globalColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function CompleteMaintenanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const { businessId } = useAuth();
  const { schedule, loading: scheduleLoading } = useMaintenanceSchedule(id);

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
  const labelStyle: TextStyle = { fontSize: 14, fontWeight: "600", color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 16, fontWeight: "600", color: colors.textPrimary, marginTop: 2 };

  async function handleComplete() {
    if (!businessId) return;
    try {
      await maintenanceService.completeSchedule(businessId, id, { notes: notes.trim() || undefined });
      Alert.alert(
        "Maintenance Completed",
        `"${schedule!.title}" has been marked as complete.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to complete maintenance.");
    }
  }

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        <Card variant="elevated" padding="large">
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textHeading, marginBottom: 12 }}>
            {schedule.title}
          </Text>
          <View style={{ gap: 8 }}>
            <View>
              <Text style={labelStyle}>Asset</Text>
              <Text style={valueStyle}>{schedule.assetName}</Text>
            </View>
            <View>
              <Text style={labelStyle}>Schedule Type</Text>
              <Text style={valueStyle}>
                {schedule.triggerType === "usage_hours"
                  ? `Every ${schedule.intervalHours} hours`
                  : `Every ${schedule.intervalDays} days`}
              </Text>
            </View>
          </View>
        </Card>

        <TextInput
          label="Notes"
          placeholder="Describe the work performed..."
          value={notes}
          onChangeText={setNotes}
        />

        <Button variant="primary" fullWidth onPress={handleComplete}>
          Mark as Complete
        </Button>
      </ScrollView>
    </View>
  );
}
