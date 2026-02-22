import AssetForm, { SelectedFile } from "@/src/components/AssetForm";
import ErrorMessage from "@/src/components/ErrorMessage";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAsset } from "@/src/hooks/useAsset";
import { CreateAssetDTO } from "@/src/types/asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";

export default function EditAssetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error } = useAsset(id);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const handleSubmit = async (data: CreateAssetDTO, file?: SelectedFile) => {
    Alert.alert("Asset Updated", `"${data.name}" has been saved.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDeleteManual = () => {
    Alert.alert("Remove Manual", "Are you sure you want to remove the maintenance manual?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => router.back() },
    ]);
  };

  return (
    <AssetForm
      initialValues={asset}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      existingManual={!!asset.manualUrl}
      onDeleteManual={handleDeleteManual}
    />
  );
}
