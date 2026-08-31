import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { colors } from "@/lib/theme";
import type { Outlet, PickupRequest } from "@/lib/types";

export default function PickupsScreen() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOutletId, setSelectedOutletId] = useState<string>("");
  const [estimatedKg, setEstimatedKg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [outletsResult, requestsResult] = await Promise.all([
        apiGet<{ outlets: Outlet[] }>("/api/vendor/outlets"),
        apiGet<{ requests: PickupRequest[] }>("/api/vendor/pickup-requests"),
      ]);
      setOutlets(outletsResult.outlets);
      setRequests(requestsResult.requests);
      setSelectedOutletId((current) => current || outletsResult.outlets[0]?.id || "");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load pickups");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleSubmit() {
    if (!selectedOutletId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiPost("/api/vendor/pickup-requests", {
        outletId: selectedOutletId,
        estimatedKg: estimatedKg ? parseFloat(estimatedKg) : undefined,
      });
      setEstimatedKg("");
      await load();
    } catch (e) {
      setSubmitError(e instanceof ApiError ? e.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      data={requests}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      ListHeaderComponent={
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Request a pickup</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          {outlets.length === 0 ? (
            <Text style={styles.hint}>No outlets yet.</Text>
          ) : (
            <>
              <Text style={styles.label}>Outlet</Text>
              <View style={{ gap: 8 }}>
                {outlets.map((o) => {
                  const active = o.id === selectedOutletId;
                  return (
                    <Pressable
                      key={o.id}
                      onPress={() => setSelectedOutletId(o.id)}
                      style={[styles.outletRow, active && styles.outletRowActive]}
                    >
                      <Text style={[styles.outletRowText, active && styles.outletRowTextActive]}>{o.name}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>Estimated kg (optional)</Text>
              <TextInput
                style={styles.input}
                value={estimatedKg}
                onChangeText={setEstimatedKg}
                keyboardType="decimal-pad"
                placeholder="e.g. 15"
                placeholderTextColor={colors.muted}
              />

              {submitError && <Text style={styles.error}>{submitError}</Text>}

              <Pressable
                style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
                onPress={handleSubmit}
                disabled={submitting || !selectedOutletId}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Submit request</Text>
                )}
              </Pressable>
            </>
          )}

          <Text style={styles.sectionTitle}>Your requests</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.hint}>No pickup requests yet.</Text>}
      renderItem={({ item }) => {
        const outlet = one(item.outlets);
        return (
          <View style={styles.card}>
            <Text style={styles.cardOutlet}>{outlet?.name}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardKg}>{item.estimated_kg != null ? `~${item.estimated_kg} kg` : "—"}</Text>
              <Text style={styles.cardStatus}>{item.status.replace("_", " ")}</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  error: { color: colors.destructive, fontSize: 13, marginBottom: 8 },
  hint: { color: colors.muted, fontSize: 13, marginTop: 8 },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },
  formTitle: { fontSize: 15, fontWeight: "700", color: colors.darkText, marginBottom: 10 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 6, fontWeight: "600" },
  outletRow: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  outletRowActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  outletRowText: { fontSize: 14, fontWeight: "600", color: colors.darkText },
  outletRowTextActive: { color: colors.white },
  input: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
    backgroundColor: colors.background,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardOutlet: { fontSize: 14, fontWeight: "700", color: colors.darkText },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  cardKg: { fontSize: 12, color: colors.green, fontWeight: "600" },
  cardStatus: { fontSize: 12, color: colors.muted, textTransform: "capitalize" },
});
