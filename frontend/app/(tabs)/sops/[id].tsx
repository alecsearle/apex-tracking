import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useSOP } from "@/src/hooks/useSOPs";
import { useColors } from "@/src/styles/globalColors";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

/**
 * Simple markdown-ish renderer for SOP content.
 * Handles headings (##), bold (**text**), bullet lists (- item), and checkboxes (- [ ]).
 * Will be replaced with a proper MarkdownViewer component later.
 */
function SimpleMarkdown({ content }: { content: string }) {
  const colors = useColors();

  const lines = content.split("\n");

  return (
    <View style={{ gap: 4 }}>
      {lines.map((line, i) => {
        const trimmed = line.trimStart();

        // Heading ##
        if (trimmed.startsWith("## ")) {
          return (
            <Text key={i} style={{
              fontSize: 18, fontWeight: "700", color: colors.textHeading,
              marginTop: i > 0 ? 16 : 0, marginBottom: 4,
            }}>
              {trimmed.replace("## ", "")}
            </Text>
          );
        }

        // Checkbox - [ ] or - [x]
        if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
          const checked = trimmed.startsWith("- [x] ");
          const text = trimmed.replace(/^- \[.\] /, "");
          return (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingLeft: 4, gap: 8, marginVertical: 2 }}>
              <Icon
                name={checked ? "check-box" : "check-box-outline-blank"}
                iosName={checked ? "checkmark.square.fill" : "square"}
                androidName={checked ? "check-box" : "check-box-outline-blank"}
                size={18}
                color={checked ? colors.brandPrimary : colors.textMuted}
              />
              <Text style={{ fontSize: 15, color: colors.textPrimary, flex: 1, lineHeight: 22 }}>{text}</Text>
            </View>
          );
        }

        // Bullet list
        if (trimmed.startsWith("- ")) {
          const text = trimmed.replace("- ", "");
          // Handle **bold** within bullets
          const parts = text.split(/(\*\*[^*]+\*\*)/);
          return (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingLeft: 4, gap: 8, marginVertical: 2 }}>
              <Text style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22 }}>•</Text>
              <Text style={{ fontSize: 15, color: colors.textPrimary, flex: 1, lineHeight: 22 }}>
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <Text key={j} style={{ fontWeight: "700" }}>{part.slice(2, -2)}</Text>
                  ) : (
                    <Text key={j}>{part}</Text>
                  )
                )}
              </Text>
            </View>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)?.[1] ?? "";
          const text = trimmed.replace(/^\d+\.\s/, "");
          return (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", paddingLeft: 4, gap: 8, marginVertical: 2 }}>
              <Text style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22, minWidth: 18 }}>{num}.</Text>
              <Text style={{ fontSize: 15, color: colors.textPrimary, flex: 1, lineHeight: 22 }}>{text}</Text>
            </View>
          );
        }

        // Empty line = spacer
        if (trimmed === "") {
          return <View key={i} style={{ height: 8 }} />;
        }

        // Regular text (with bold support)
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
        return (
          <Text key={i} style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 22 }}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <Text key={j} style={{ fontWeight: "700" }}>{part.slice(2, -2)}</Text>
              ) : (
                <Text key={j}>{part}</Text>
              )
            )}
          </Text>
        );
      })}
    </View>
  );
}

export default function SOPDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { sop } = useSOP(id);

  if (!sop) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>SOP not found</Text>
      </View>
    );
  }

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, gap: 16, paddingBottom: 32 };
  const labelStyle: TextStyle = { fontSize: 13, color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 14, fontWeight: "600", color: colors.textPrimary };

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        {/* Header */}
        <Card variant="elevated" padding="large">
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textHeading, marginBottom: 12 }}>
            {sop.title}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            <View>
              <Text style={labelStyle}>Linked Asset</Text>
              <Text style={[valueStyle, sop.assetName ? { color: colors.brandPrimary } : {}]}>
                {sop.assetName ?? "All Assets"}
              </Text>
            </View>
            <View>
              <Text style={labelStyle}>Source</Text>
              <Text style={valueStyle}>{sop.source === "manual" ? "Manual" : "Custom"}</Text>
            </View>
            <View>
              <Text style={labelStyle}>Created By</Text>
              <Text style={valueStyle}>{sop.createdByName}</Text>
            </View>
            <View>
              <Text style={labelStyle}>Last Updated</Text>
              <Text style={valueStyle}>{new Date(sop.updatedAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </Card>

        {/* Content */}
        <Card variant="elevated" padding="large">
          <SimpleMarkdown content={sop.content} />
        </Card>
      </ScrollView>
    </View>
  );
}
