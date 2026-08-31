import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { apiGet, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";
import type { PickupRequest, Stats } from "@/lib/types";

export default function HomeScreen() {
  const router = useRouter();
  const { organization } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [nextPickup, setNextPickup] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [statsResult, requestsResult] = await Promise.all([
        apiGet<Stats>("/api/vendor/stats"),
        apiGet<{ requests: PickupRequest[] }>("/api/vendor/pickup-requests"),
      ]);
      setStats(statsResult);
      const pending = requestsResult.requests.find((r) => !["completed", "cancelled", "failed"].includes(r.status));
      setNextPickup(pending ?? null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load your dashboard");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
    >
      <Text style={styles.greeting}>{organization?.legal_name}</Text>
      <Text style={styles.location}>
        {organization?.segment} · {organization?.city}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.card}>
        {nextPickup ? (
          <>
            <Text style={styles.cardLabel}>Next pickup</Text>
            <Text style={styles.cardValue}>
              {one(nextPickup.outlets)?.name} · {nextPickup.status.replace("_", " ")}
            </Text>
            {nextPickup.estimated_kg != null && (
              <Text style={styles.cardSub}>~{nextPickup.estimated_kg} kg estimated</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.cardLabel}>No pickup scheduled</Text>
            <Text style={styles.cardSub}>Request one below whenever you have oil ready.</Text>
          </>
        )}
        <Pressable style={styles.requestButton} onPress={() => router.push("/pickups")}>
          <Text style={styles.requestButtonText}>Request a Pickup</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>This month</Text>
      <View style={styles.grid}>
        <Stat label="Kg collected" value={`${stats?.month.kg.toFixed(1) ?? "0"} kg`} />
        <Stat label="Pickups" value={`${stats?.month.count ?? 0}`} />
        <Stat label="Paid out" value={`₹${stats?.month.payable.toFixed(0) ?? "0"}`} highlight />
      </View>

      <Text style={styles.sectionTitle}>All time</Text>
      <View style={styles.grid}>
        <Stat label="Total kg" value={`${stats?.lifetime.kg.toFixed(1) ?? "0"} kg`} />
        <Stat label="CO₂ avoided (est.)" value={`${stats?.lifetime.co2eKgEstimate ?? 0} kg`} />
      </View>
      <Text style={styles.hint}>
        CO₂ figure is a rough estimate, not a certified measurement — useful directionally, not for
        formal reporting yet.
      </Text>
    </ScrollView>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, highlight && { color: colors.green }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  error: { color: colors.destructive, marginTop: 8, marginBottom: 8 },
  greeting: { fontSize: 20, fontWeight: "700", color: colors.darkText },
  location: { fontSize: 13, color: colors.muted, marginTop: 2, marginBottom: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 24,
  },
  cardLabel: { fontSize: 12, color: colors.muted, fontWeight: "600", textTransform: "uppercase" },
  cardValue: { fontSize: 16, fontWeight: "700", color: colors.darkText, marginTop: 4, textTransform: "capitalize" },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  requestButton: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  requestButtonText: { color: colors.white, fontWeight: "700", fontSize: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statTile: {
    flexGrow: 1,
    minWidth: "30%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: "600" },
  statValue: { fontSize: 16, fontWeight: "700", color: colors.darkText, marginTop: 4 },
  hint: { fontSize: 11, color: colors.muted, marginTop: -12 },
});
