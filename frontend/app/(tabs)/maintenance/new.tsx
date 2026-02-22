import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import TextInput from "@/src/components/TextInput";
import { MOCK_ASSETS } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { ScheduleTrigger } from "@/src/types/maintenance";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function NewMaintenanceScheduleScreen() {
  const colors = useColors();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [triggerType, setTriggerType] = useState<ScheduleTrigger>("usage_hours");
  const [intervalValue, setIntervalValue] = useState("");

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 48 };
  const sectionLabel: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
  };

  function handleSubmit() {
    if (!selectedAssetId) {
      Alert.alert("Error", "Please select an asset.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }
    if (!intervalValue.trim() || isNaN(Number(intervalValue))) {
      Alert.alert("Error", "Please enter a valid interval number.");
      return;
    }
    const asset = MOCK_ASSETS.find((a) => a.id === selectedAssetId);
    Alert.alert(
      "Schedule Created",
      `"${title}" for ${asset?.name} has been created.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
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

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {/* Asset Picker */}
        <Text style={sectionLabel}>Asset</Text>
        <View style={{ gap: 8 }}>
          {MOCK_ASSETS.map((asset) => (
            <Card
              key={asset.id}
              variant={selectedAssetId === asset.id ? "elevated" : "outlined"}
              padding="medium"
              onPress={() => setSelectedAssetId(asset.id)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 20, height: 20, borderRadius: 10, marginRight: 12,
                  borderWidth: 2, borderColor: selectedAssetId === asset.id ? colors.brandPrimary : colors.border,
                  backgroundColor: selectedAssetId === asset.id ? colors.brandPrimary : "transparent",
                  justifyContent: "center", alignItems: "center",
                }}>
                  {selectedAssetId === asset.id && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFFFFF" }} />
                  )}
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>{asset.name}</Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>{asset.brand} · {asset.model}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Schedule Info */}
        <Text style={[sectionLabel, { marginTop: 8 }]}>Schedule Info</Text>
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

        <Button variant="primary" onPress={handleSubmit} fullWidth>
          Create Schedule
        </Button>
      </ScrollView>
    </View>
  );
}
