import AssetForm, { PhotoChange, SelectedFile } from "@/src/components/AssetForm";
import { useAuth } from "@/src/hooks/useAuth";
import { assetService } from "@/src/services/assetService";
import { CreateAssetDTO } from "@/src/types/asset";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function NewAssetScreen() {
  const router = useRouter();
  const { businessId } = useAuth();

  const handleSubmit = async (data: CreateAssetDTO, file?: SelectedFile, photo?: PhotoChange) => {
    if (!businessId) {
      Alert.alert("Error", "No business found. Please log in again.");
      return;
    }

    const asset = await assetService.create(businessId, data);

    // Upload photo if provided (null/undefined means nothing to do on create)
    if (photo && asset.id) {
      try {
        await assetService.uploadPhoto(businessId, asset.id, photo.uri, photo.name, photo.mimeType);
      } catch {
        Alert.alert("Note", "Asset created but photo upload failed. You can retry from the asset details.");
      }
    }

    // Upload manual PDF if provided
    if (file && asset.id) {
      try {
        await assetService.uploadManual(businessId, asset.id, file.uri, file.name);
      } catch {
        // Asset was created; manual upload failed — non-blocking
        Alert.alert("Note", "Asset created but manual upload failed. You can retry from the asset details.");
      }
    }

    Alert.alert("Asset Created", `"${data.name}" has been added.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return <AssetForm onSubmit={handleSubmit} submitLabel="Add Asset" />;
}
