import AssetForm, { SelectedFile } from "@/src/components/AssetForm";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import ErrorMessage from "@/src/components/ErrorMessage";
import { useAsset } from "@/src/hooks/useAsset";
import { assetService } from "@/src/services/assetService";
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
    await assetService.update(id, data);

    if (file) {
      await assetService.uploadManual(id, file.uri, file.name);
    }

    router.back();
  };

  const handleDeleteManual = () => {
    Alert.alert("Remove Manual", "Are you sure you want to remove the maintenance manual?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await assetService.deleteManual(id);
            router.back();
          } catch (err) {
            Alert.alert(
              "Error",
              err instanceof Error ? err.message : "Failed to remove manual"
            );
          }
        },
      },
    ]);
  };

  return (
    <AssetForm
      initialValues={asset}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      existingManual={!!asset.manualFileName}
      onDeleteManual={handleDeleteManual}
    />
  );
}
