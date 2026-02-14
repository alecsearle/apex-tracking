import AssetForm from "@/src/components/AssetForm";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import ErrorMessage from "@/src/components/ErrorMessage";
import { useAsset } from "@/src/hooks/useAsset";
import { assetService } from "@/src/services/assetService";
import { CreateAssetDTO } from "@/src/types/asset";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditAssetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading, error } = useAsset(id);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (!asset) return <ErrorMessage message="Asset not found" />;

  const handleSubmit = async (data: CreateAssetDTO) => {
    await assetService.update(id, data);
    router.back();
  };

  return (
    <AssetForm
      initialValues={asset}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
    />
  );
}
