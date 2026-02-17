import AssetForm, { SelectedFile } from "@/src/components/AssetForm";
import { assetService } from "@/src/services/assetService";
import { CreateAssetDTO } from "@/src/types/asset";
import { useRouter } from "expo-router";

export default function NewAssetScreen() {
  const router = useRouter();

  const handleSubmit = async (data: CreateAssetDTO, file?: SelectedFile) => {
    const asset = await assetService.create(data);

    if (file) {
      await assetService.uploadManual(asset.id, file.uri, file.name);
    }

    router.back();
  };

  return <AssetForm onSubmit={handleSubmit} submitLabel="Add Asset" />;
}
