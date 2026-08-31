import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, View } from "react-native";
import { apiGet, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { colors } from "@/lib/theme";
import type { CollectionSummary } from "@/lib/types";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function HistoryScreen() {
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const { collections } = await apiGet<{ collections: CollectionSummary[] }>("/api/vendor/collections");
      setCollections(collections);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load history");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const totalKg = collections.reduce((sum, c) => sum + Number(c.net_kg), 0);
  const totalPayable = collections.reduce((sum, c) => sum + Number(c.net_payable), 0);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListHeaderComponent={
            collections.length > 0 ? (
              <Text style={styles.summary}>
                {collections.length} collections · {totalKg.toFixed(1)} kg · ₹{totalPayable.toFixed(0)} paid
              </Text>
            ) : null
          }
          ListEmptyComponent={<Text style={styles.empty}>No collections yet.</Text>}
          renderItem={({ item }) => {
            const outlet = one(item.outlets);
            return (
              <View style={styles.card}>
                {item.photo_url ? (
                  <Image source={{ uri: item.photo_url }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardOutlet}>{outlet?.name}</Text>
                  <Text style={styles.cardMeta}>
                    {DATE_FORMAT.format(new Date(item.collected_at))} · {item.quality_grade}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.cardKg}>{item.net_kg} kg</Text>
                  <Text style={styles.cardPayable}>₹{item.net_payable}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  error: { color: colors.destructive, marginTop: 24, textAlign: "center" },
  empty: { color: colors.muted, marginTop: 40, textAlign: "center" },
  summary: { fontSize: 13, color: colors.muted, marginBottom: 12, fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  thumb: { width: 48, height: 48, borderRadius: 10 },
  thumbPlaceholder: { backgroundColor: colors.lightGreen },
  cardOutlet: { fontSize: 14, fontWeight: "700", color: colors.darkText },
  cardMeta: { fontSize: 11, color: colors.muted, marginTop: 2, textTransform: "capitalize" },
  cardKg: { fontSize: 13, fontWeight: "700", color: colors.darkText },
  cardPayable: { fontSize: 12, color: colors.green, fontWeight: "600", marginTop: 2 },
});
