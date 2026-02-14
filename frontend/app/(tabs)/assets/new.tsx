import AssetForm from "@/src/components/AssetForm";
import { assetService } from "@/src/services/assetService";
import { CreateAssetDTO } from "@/src/types/asset";
import { useRouter } from "expo-router";

export default function NewAssetScreen() {
  const router = useRouter();

  const handleSubmit = async (data: CreateAssetDTO) => {
    await assetService.create(data);
    router.back();
  };

  return <AssetForm onSubmit={handleSubmit} submitLabel="Add Asset" />;
}
