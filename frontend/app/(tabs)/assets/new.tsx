import AssetForm, { SelectedFile } from "@/src/components/AssetForm";
import { CreateAssetDTO } from "@/src/types/asset";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function NewAssetScreen() {
  const router = useRouter();

  const handleSubmit = async (data: CreateAssetDTO, file?: SelectedFile) => {
    // Mock: just show success and go back
    Alert.alert("Asset Created", `"${data.name}" has been added.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return <AssetForm onSubmit={handleSubmit} submitLabel="Add Asset" />;
}
