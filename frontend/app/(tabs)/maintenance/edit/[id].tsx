import Button from "@/src/components/Button";
import TextInput from "@/src/components/TextInput";
import { useMaintenanceSchedule } from "@/src/hooks/useMaintenanceSchedule";
import { useColors } from "@/src/styles/globalColors";
import { ScheduleTrigger } from "@/src/types/maintenance";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function EditMaintenanceScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { schedule, loading, updateSchedule } = useMaintenanceSchedule(id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<ScheduleTrigger>("usage_hours");
  const [intervalValue, setIntervalValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setDescription(schedule.description ?? "");
      setTriggerType(schedule.triggerType);
      setIntervalValue(
        schedule.triggerType === "usage_hours"
          ? String(schedule.intervalHours ?? "")
          : String(schedule.intervalDays ?? "")
      );
    }
  }, [schedule]);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 48 };
  const sectionLabel: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
  };

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }
    if (!intervalValue.trim() || isNaN(Number(intervalValue))) {
      Alert.alert("Error", "Please enter a valid interval number.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await updateSchedule({
        title: title.trim(),
        description: description.trim() || undefined,
        ...(triggerType === "usage_hours"
          ? { intervalHours: Number(intervalValue) }
          : { intervalDays: Number(intervalValue) }),
      });
      if (result) {
        Alert.alert("Schedule Updated", `"${title}" has been updated.`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update schedule.");
    } finally {
      setSubmitting(false);
    }
  }

  const triggerOption = (type: ScheduleTrigger, label: string) => {
    const active = triggerType === type;
    return (
      <Pressable
        onPress={() => setTriggerType(type)}
        style={{
          flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center",
          backgroundColor: active ? colors.brandPrimary : colors.backgroundCard,
          borderWidth: 1.5, borderColor: active ? colors.brandPrimary : colors.border,
        }}
      >
        <Text style={{
          fontSize: 14, fontWeight: "600",
          color: active ? "#FFFFFF" : colors.textSecondary,
        }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        <TextInput label="Title" placeholder="e.g. Oil Change" value={title} onChangeText={setTitle} />
        <TextInput label="Description (optional)" placeholder="Describe the maintenance task" value={description} onChangeText={setDescription} />

        {/* Trigger Type */}
        <Text style={sectionLabel}>Trigger Type</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {triggerOption("usage_hours", "Usage Hours")}
          {triggerOption("time_interval", "Time Interval")}
        </View>

        {/* Interval */}
        <TextInput
          label={triggerType === "usage_hours" ? "Interval (hours)" : "Interval (days)"}
          placeholder={triggerType === "usage_hours" ? "e.g. 50" : "e.g. 30"}
          value={intervalValue}
          onChangeText={setIntervalValue}
          keyboardType="numeric"
        />

        <Button variant="primary" onPress={handleSubmit} fullWidth disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </ScrollView>
    </View>
  );
}
