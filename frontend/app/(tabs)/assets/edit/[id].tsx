import AssetForm, { PhotoChange, SelectedFile } from "@/src/components/AssetForm";
import ErrorMessage from "@/src/components/ErrorMessage";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAsset } from "@/src/hooks/useAsset";
import { useAuth } from "@/src/hooks/useAuth";
import { assetService } from "@/src/services/assetService";
import { CreateAssetDTO } from "@/src/types/asset";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";

export default function EditAssetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error } = useAsset(id);
  const { businessId } = useAuth();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const handleSubmit = async (data: CreateAssetDTO, file?: SelectedFile, photo?: PhotoChange) => {
    if (!businessId) {
      Alert.alert("Error", "No business found. Please log in again.");
      return;
    }

    try {
      await assetService.update(businessId, id, data);

      // Apply photo change: upload new, delete existing, or leave alone
      if (photo) {
        try {
          await assetService.uploadPhoto(businessId, id, photo.uri, photo.name, photo.mimeType);
        } catch {
          Alert.alert("Note", "Asset saved but photo upload failed. You can retry from the edit screen.");
        }
      } else if (photo === null) {
        try {
          await assetService.deletePhoto(businessId, id);
        } catch {
          Alert.alert("Note", "Asset saved but photo removal failed. You can retry from the edit screen.");
        }
      }

      // Upload manual PDF if a new file was selected
      if (file) {
        try {
          await assetService.uploadManual(businessId, id, file.uri, file.name);
        } catch {
          Alert.alert("Note", "Asset saved but manual upload failed. You can retry from the asset details.");
        }
      }

      Alert.alert("Asset Updated", `"${data.name}" has been saved.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update asset.");
    }
  };

  const handleDeleteManual = () => {
    if (!businessId) return;
    Alert.alert("Remove Manual", "Are you sure you want to remove the maintenance manual?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await assetService.deleteManual(businessId, id);
            Alert.alert("Manual Removed", "The maintenance manual has been removed.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to remove manual.");
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
      existingManual={!!asset.manualUrl}
      onDeleteManual={handleDeleteManual}
    />
  );
}
