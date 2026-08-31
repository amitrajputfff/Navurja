import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { apiGet, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { colors } from "@/lib/theme";
import { openDirections } from "@/lib/directions";
import type { CollectionDetail } from "@/lib/types";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiGet<{ collection: CollectionDetail }>(`/api/mobile/collections/${id}`)
      .then(({ collection }) => {
        if (!cancelled) setCollection(collection);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load this collection");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !collection) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Collection not found"}</Text>
      </View>
    );
  }

  const outlet = one(collection.outlets);
  const org = outlet ? one(outlet.organizations) : undefined;
  const payment = one(collection.payments);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <Stack.Screen options={{ title: "Collection" }} />

      {collection.photo_url && (
        <Image source={{ uri: collection.photo_url }} style={styles.photo} />
      )}

      <View style={styles.card}>
        <Text style={styles.org}>{org?.legal_name ?? "Unknown business"}</Text>
        <Text style={styles.outlet}>{outlet?.name}</Text>
        <Text style={styles.address}>{outlet?.address}</Text>
        {outlet && (
          <Pressable
            style={styles.directionsButton}
            onPress={() => openDirections(null, null, outlet.address)}
          >
            <Ionicons name="navigate" size={14} color={colors.primary} />
            <Text style={styles.directionsText}>Directions</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.dateText}>{DATE_FORMAT.format(new Date(collection.collected_at))}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <View style={styles.grid}>
          <Stat label="Gross" value={collection.gross_kg != null ? `${collection.gross_kg} kg` : "—"} />
          <Stat label="Tare" value={collection.tare_kg != null ? `${collection.tare_kg} kg` : "—"} />
          <Stat label="Net" value={`${collection.net_kg} kg`} highlight />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.grid}>
          <Stat label="Grade" value={collection.quality_grade} capitalize />
          <Stat label="Rate" value={`₹${collection.rate_per_kg}/kg`} />
          <Stat label="Payable" value={`₹${collection.net_payable}`} highlight />
        </View>
        {payment && (
          <Text style={styles.paymentMeta}>
            Paid via {payment.mode.replace("_", " ")} · {payment.status}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification</Text>
        <View style={styles.verifyRow}>
          <Ionicons
            name={collection.gps_lat != null ? "checkmark-circle" : "close-circle"}
            size={16}
            color={collection.gps_lat != null ? colors.green : colors.muted}
          />
          <Text style={styles.verifyText}>
            {collection.gps_lat != null
              ? `Location captured (${collection.gps_lat.toFixed(5)}, ${collection.gps_lng?.toFixed(5)})`
              : "No location recorded"}
          </Text>
        </View>
        <View style={styles.verifyRow}>
          <Ionicons
            name={collection.confirmation_otp_verified ? "checkmark-circle" : "close-circle"}
            size={16}
            color={collection.confirmation_otp_verified ? colors.green : colors.muted}
          />
          <Text style={styles.verifyText}>
            {collection.confirmation_otp_verified
              ? "Outlet contact confirmed verbally"
              : "No verbal confirmation recorded"}
          </Text>
        </View>
      </View>

      {collection.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{collection.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  highlight,
  capitalize,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  capitalize?: boolean;
}) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          highlight && { color: colors.green },
          capitalize && { textTransform: "capitalize" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  error: { color: colors.destructive, fontSize: 14 },
  photo: { width: "100%", height: 220, borderRadius: 16, backgroundColor: "#eee", marginBottom: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  org: { fontSize: 16, fontWeight: "700", color: colors.darkText },
  outlet: { fontSize: 14, color: colors.darkText, marginTop: 2 },
  address: { fontSize: 13, color: colors.muted, marginTop: 2 },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.lightGreen,
  },
  directionsText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  dateText: { fontSize: 12, color: colors.muted, marginTop: 12, marginBottom: 4 },
  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  grid: { flexDirection: "row", gap: 10 },
  statTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: "600" },
  statValue: { fontSize: 15, fontWeight: "700", color: colors.darkText, marginTop: 4 },
  paymentMeta: { fontSize: 12, color: colors.muted, marginTop: 8, textTransform: "capitalize" },
  verifyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  verifyText: { fontSize: 13, color: colors.darkText, flex: 1 },
  notes: { fontSize: 14, color: colors.darkText, lineHeight: 20 },
});
