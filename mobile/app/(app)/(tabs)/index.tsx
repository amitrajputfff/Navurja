import { useCallback, useState } from "react";
import { useFocusEffect, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { apiGet, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";
import { openDirections, callPhone } from "@/lib/directions";
import type { PickupRequest } from "@/lib/types";

export default function TodaysRequestsScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const { requests } = await apiGet<{ requests: PickupRequest[] }>("/api/mobile/pickup-requests");
      setRequests(requests);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load requests");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  // Refetch every time this screen regains focus (e.g. coming back from a
  // completed collection) rather than only once on mount.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Today's Requests" }} />

      <Text style={styles.greeting}>
        {profile?.full_name ?? profile?.email} · {requests.length} assigned
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No pickups assigned right now. Pull to refresh.</Text>
          }
          renderItem={({ item }) => {
            const outlet = one(item.outlets);
            const org = outlet ? one(outlet.organizations) : undefined;
            return (
              <View style={styles.card}>
                <Pressable onPress={() => router.push(`/collect/${item.id}`)}>
                  <Text style={styles.cardOrg}>{org?.legal_name ?? "Unknown business"}</Text>
                  <Text style={styles.cardOutlet}>{outlet?.name}</Text>
                  <Text style={styles.cardAddress}>{outlet?.address}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardKg}>~{item.estimated_kg ?? "?"} kg estimated</Text>
                    <Text style={styles.cardStatus}>{item.status}</Text>
                  </View>
                </Pressable>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => outlet && openDirections(outlet.lat, outlet.lng, outlet.address)}
                  >
                    <Ionicons name="navigate" size={14} color={colors.primary} />
                    <Text style={styles.actionText}>Directions</Text>
                  </Pressable>
                  {outlet?.contact_phone && (
                    <Pressable style={styles.actionButton} onPress={() => callPhone(outlet.contact_phone!)}>
                      <Ionicons name="call" size={14} color={colors.primary} />
                      <Text style={styles.actionText}>Call</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={[styles.actionButton, styles.collectButton]}
                    onPress={() => router.push(`/collect/${item.id}`)}
                  >
                    <Text style={styles.collectButtonText}>Collect</Text>
                  </Pressable>
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
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 12 },
  greeting: { fontSize: 13, color: colors.muted, marginBottom: 12 },
  error: { color: colors.destructive, marginTop: 24, textAlign: "center" },
  empty: { color: colors.muted, marginTop: 40, textAlign: "center" },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardOrg: { fontSize: 15, fontWeight: "700", color: colors.darkText },
  cardOutlet: { fontSize: 13, color: colors.darkText, marginTop: 2 },
  cardAddress: { fontSize: 13, color: colors.muted, marginTop: 2 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cardKg: { fontSize: 12, fontWeight: "600", color: colors.green },
  cardStatus: { fontSize: 12, color: colors.muted, textTransform: "capitalize" },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 14, alignItems: "center" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.lightGreen,
  },
  actionText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  collectButton: { marginLeft: "auto", backgroundColor: colors.primary },
  collectButtonText: { fontSize: 12, fontWeight: "700", color: colors.white },
});
