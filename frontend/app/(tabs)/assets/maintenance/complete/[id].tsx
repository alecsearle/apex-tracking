import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import TextInput from "@/src/components/TextInput";
import { MOCK_SCHEDULES } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function AssetCompleteMaintenanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [notes, setNotes] = useState("");

  const schedule = MOCK_SCHEDULES.find((s) => s.id === id);

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

  function handleComplete() {
    Alert.alert(
      "Maintenance Completed",
      `"${schedule!.title}" has been marked as complete.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
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
