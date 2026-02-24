import AssetListItem from "@/src/components/AssetListItem";
import EmptyState from "@/src/components/EmptyState";
import ErrorMessage from "@/src/components/ErrorMessage";
import FilterChips from "@/src/components/FilterChips";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import SearchBar from "@/src/components/SearchBar";
import { useAssets } from "@/src/hooks/useAssets";
import { useColors } from "@/src/styles/globalColors";
import { AssetStatus } from "@/src/types/asset";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View, ViewStyle } from "react-native";
import Icon from "@/src/components/Icon";
import { Stack } from "expo-router";

type StatusFilter = "all" | AssetStatus;

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "In Use", value: "in_use" },
  { label: "Maintenance", value: "maintenance" },
];

export default function AssetsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { assets, loading, error, refetch } = useAssets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredAssets = useMemo(() => {
    const query = search.toLowerCase().trim();
    return assets.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (query) {
        const haystack = `${a.name} ${a.brand} ${a.model}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [assets, search, statusFilter]);

  if (loading && assets.length === 0) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  };

  const headerStyle: ViewStyle = {
    gap: 12,
    paddingBottom: 4,
  };

  const ListHeader = (
    <View style={headerStyle}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search assets…"
      />
      <FilterChips
        options={filterOptions}
        selected={statusFilter}
        onSelect={setStatusFilter}
      />
    </View>
  );

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
          data={filteredAssets}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
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
