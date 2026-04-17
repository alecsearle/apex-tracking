import Button from "@/src/components/Button";
import TextInput from "@/src/components/TextInput";
import { useSOP } from "@/src/hooks/useSOPs";
import { useColors } from "@/src/styles/globalColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, ViewStyle } from "react-native";

export default function EditSOPScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { sop, loading, updateSop } = useSOP(id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sop) {
      setTitle(sop.title);
      setContent(sop.content);
    }
  }, [sop]);

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentContainerStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 48 };

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Content is required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await updateSop({
        title: title.trim(),
        content: content.trim(),
      });
      if (result) {
        Alert.alert("SOP Updated", `"${title}" has been updated.`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update SOP.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <TextInput label="Title" placeholder="e.g. Pre-Start Safety Check" value={title} onChangeText={setTitle} />
        <TextInput label="Content (Markdown)" placeholder="Write the SOP content here..." value={content} onChangeText={setContent} multiline />

        <Button variant="primary" onPress={handleSubmit} fullWidth disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </ScrollView>
    </View>
  );
}
