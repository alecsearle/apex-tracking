import AssetListItem from "@/src/components/AssetListItem";
import EmptyState from "@/src/components/EmptyState";
import ErrorMessage from "@/src/components/ErrorMessage";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAssets } from "@/src/hooks/useAssets";
import { useColors } from "@/src/styles/globalColors";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, View, ViewStyle } from "react-native";
import Icon from "@/src/components/Icon";
import { Stack } from "expo-router";

export default function AssetsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { assets, loading, error, refetch } = useAssets();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading && assets.length === 0) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  };

  return (
    <View style={containerStyle}>
      <Stack.Screen
        options={{
          title: "Assets",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/assets/new")}
              hitSlop={8}
            >
              <Icon
                name="add"
                iosName="plus"
                androidName="add"
                size={22}
                color={colors.brandPrimary}
              />
            </Pressable>
          ),
        }}
      />
      {assets.length === 0 ? (
        <EmptyState
          message="No assets yet"
          actionLabel="Add your first asset"
          onAction={() => router.push("/assets/new")}
        />
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AssetListItem
              asset={item}
              onPress={() => router.push(`/assets/${item.id}`)}
            />
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}
    </View>
  );
}
