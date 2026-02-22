import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import TextInput from "@/src/components/TextInput";
import { MOCK_ASSETS } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function NewSOPScreen() {
  const colors = useColors();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentContainerStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 48 };
  const sectionLabel: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
  };

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Content is required.");
      return;
    }
    Alert.alert("SOP Created", `"${title}" has been created.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <TextInput label="Title" placeholder="e.g. Pre-Start Safety Check" value={title} onChangeText={setTitle} />

        {/* Asset Picker (optional) */}
        <Text style={sectionLabel}>Link to Asset (optional)</Text>
        <View style={{ gap: 8 }}>
          <Card
            variant={selectedAssetId === null ? "elevated" : "outlined"}
            padding="medium"
            onPress={() => setSelectedAssetId(null)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 20, height: 20, borderRadius: 10, marginRight: 12,
                borderWidth: 2, borderColor: selectedAssetId === null ? colors.brandPrimary : colors.border,
                backgroundColor: selectedAssetId === null ? colors.brandPrimary : "transparent",
                justifyContent: "center", alignItems: "center",
              }}>
                {selectedAssetId === null && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFFFFF" }} />
                )}
              </View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>Business-wide (all assets)</Text>
            </View>
          </Card>
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
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>{asset.name}</Text>
              </View>
            </Card>
          ))}
        </View>

        <TextInput label="Content (Markdown)" placeholder="Write the SOP content here..." value={content} onChangeText={setContent} multiline />

        <Button variant="primary" onPress={handleSubmit} fullWidth>
          Create SOP
        </Button>
      </ScrollView>
    </View>
  );
}
