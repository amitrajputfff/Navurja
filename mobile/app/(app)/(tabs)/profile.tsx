import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, Stack } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiGet, apiPatch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";
import type { Stats } from "@/lib/types";

export default function ProfileScreen() {
  const { profile, signOut, refreshProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) setName(profile?.full_name ?? "");
  }, [profile?.full_name, editing]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const result = await apiGet<Stats>("/api/mobile/stats");
      setStats(result);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await apiPatch("/api/mobile/me", { fullName: name.trim() });
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function confirmSignOut() {
    Alert.alert("Sign out?", "You'll need to sign in again to record collections.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: "Profile" }} />

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(profile?.full_name ?? profile?.email ?? "?").trim()[0]?.toUpperCase()}
        </Text>
      </View>

      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            autoFocus
          />
          <Pressable onPress={handleSave} disabled={saving} style={styles.saveButton}>
            {saving ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={styles.saveButtonText}>Save</Text>}
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setEditing(true)} style={styles.nameRow}>
          <Text style={styles.name}>{profile?.full_name || "Add your name"}</Text>
          <Text style={styles.editHint}>Edit</Text>
        </Pressable>
      )}
      {saveError && <Text style={styles.error}>{saveError}</Text>}

      <Text style={styles.email}>{profile?.email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleBadgeText}>{profile?.role}</Text>
      </View>

      <Text style={styles.sectionTitle}>This week</Text>
      {statsLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />
      ) : stats ? (
        <View style={styles.statsGrid}>
          <StatTile label="Today" value={`${stats.today.kg.toFixed(1)} kg`} sub={`${stats.today.count} pickups`} />
          <StatTile label="Today" value={`₹${stats.today.payable.toFixed(0)}`} sub="paid out" />
          <StatTile label="This week" value={`${stats.week.kg.toFixed(1)} kg`} sub={`${stats.week.count} pickups`} />
          <StatTile label="This week" value={`₹${stats.week.payable.toFixed(0)}`} sub="paid out" />
        </View>
      ) : (
        <Text style={styles.empty}>Couldn&apos;t load stats.</Text>
      )}

      <Pressable style={styles.signOutButton} onPress={confirmSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: "700" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontSize: 20, fontWeight: "700", color: colors.darkText },
  editHint: { fontSize: 12, color: colors.green, fontWeight: "600" },
  editRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.darkText,
    backgroundColor: colors.white,
  },
  saveButton: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  saveButtonText: { color: colors.white, fontWeight: "600", fontSize: 13 },
  error: { color: colors.destructive, fontSize: 12, marginTop: 6 },
  email: { fontSize: 13, color: colors.muted, marginTop: 4 },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.lightGreen,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  roleBadgeText: { fontSize: 11, fontWeight: "700", color: colors.primary, textTransform: "capitalize" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 10,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statTile: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: "600" },
  statValue: { fontSize: 18, fontWeight: "700", color: colors.darkText, marginTop: 4 },
  statSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  empty: { color: colors.muted, marginTop: 12 },
  signOutButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: colors.destructive,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: { color: colors.destructive, fontWeight: "700", fontSize: 15 },
});
