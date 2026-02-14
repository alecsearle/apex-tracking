import Button from "@/src/components/Button";
import ErrorMessage from "@/src/components/ErrorMessage";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useAsset } from "@/src/hooks/useAsset";
import { assetService } from "@/src/services/assetService";
import { useColors } from "@/src/styles/globalColors";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

export default function AssetDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error, refetch } = useAsset(id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const handleDelete = () => {
    Alert.alert("Delete Asset", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await assetService.delete(id);
            router.back();
          } catch (err) {
            Alert.alert(
              "Error",
              err instanceof Error ? err.message : "Failed to delete asset"
            );
          }
        },
      },
    ]);
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  };

  const scrollContent: ViewStyle = {
    padding: 16,
    paddingBottom: 32,
  };

  const headerCard: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
  };

  const headerIcon: ViewStyle = {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.brandLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  };

  const nameStyle: TextStyle = {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textHeading,
    letterSpacing: -0.5,
  };

  const brandModelStyle: TextStyle = {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 2,
  };

  const sectionTitle: TextStyle = {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  };

  const detailRow: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  };

  const lastDetailRow: ViewStyle = {
    ...detailRow,
    borderBottomWidth: 0,
  };

  const labelStyle: TextStyle = {
    fontSize: 15,
    color: colors.textSecondary,
  };

  const valueStyle: TextStyle = {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  };

  const actionsStyle: ViewStyle = {
    marginTop: 28,
    gap: 10,
    alignItems: "center",
  };

  return (
    <ScrollView style={containerStyle} contentContainerStyle={scrollContent}>
      <Card variant="elevated" padding="large">
        <View style={headerCard}>
          <View style={headerIcon}>
            <Icon
              name="build"
              iosName="wrench.fill"
              androidName="build"
              size={28}
              color={colors.brandPrimary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={nameStyle}>{asset.name}</Text>
            <Text style={brandModelStyle}>
              {asset.brand} · {asset.model}
            </Text>
          </View>
        </View>
      </Card>

      <Text style={sectionTitle}>Details</Text>
      <Card variant="elevated" padding="none">
        <View style={{ paddingHorizontal: 16 }}>
          <View style={detailRow}>
            <Text style={labelStyle}>Serial Number</Text>
            <Text style={valueStyle}>{asset.serialNumber}</Text>
          </View>
          <View style={detailRow}>
            <Text style={labelStyle}>Purchase Date</Text>
            <Text style={valueStyle}>{asset.purchaseDate}</Text>
          </View>
          <View style={detailRow}>
            <Text style={labelStyle}>NFC Tag</Text>
            <Text style={[valueStyle, !asset.nfcTagId && { color: colors.textMuted }]}>
              {asset.nfcTagId || "Not assigned"}
            </Text>
          </View>
          <View style={lastDetailRow}>
            <Text style={labelStyle}>Total Usage</Text>
            <Text
              style={[
                valueStyle,
                asset.totalUsageHours != null
                  ? { color: colors.brandPrimary }
                  : { color: colors.textMuted },
              ]}
            >
              {asset.totalUsageHours != null
                ? `${asset.totalUsageHours}h`
                : "No usage recorded"}
            </Text>
          </View>
        </View>
      </Card>

      <View style={actionsStyle}>
        <Button
          variant="primary"
          fullWidth
          icon="edit"
          iosIcon="pencil"
          androidIcon="edit"
          onPress={() => router.push(`/assets/edit/${id}`)}
        >
          Edit Asset
        </Button>
        <Button variant="ghost" status="error" fullWidth onPress={handleDelete}>
          Delete Asset
        </Button>
      </View>
    </ScrollView>
  );
}
