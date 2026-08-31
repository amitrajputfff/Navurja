import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { apiPatch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";

export default function ProfileScreen() {
  const { profile, organization, signOut, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) setName(profile?.full_name ?? "");
  }, [profile?.full_name, editing]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await apiPatch("/api/vendor/me", { fullName: name.trim(), phone: profile?.phone });
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function confirmSignOut() {
    Alert.alert("Sign out?", "You'll need to sign in again to manage pickups.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(profile?.full_name ?? profile?.email ?? "?").trim()[0]?.toUpperCase()}</Text>
      </View>

      {editing ? (
        <View style={styles.editRow}>
          <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} autoFocus />
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
      {profile?.phone && <Text style={styles.email}>{profile.phone}</Text>}

      <Text style={styles.sectionTitle}>Business</Text>
      <View style={styles.card}>
        <Text style={styles.businessName}>{organization?.legal_name}</Text>
        <Text style={styles.businessMeta}>
          {organization?.segment} · {organization?.city}
        </Text>
      </View>

      <Pressable style={styles.signOutButton} onPress={confirmSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 10,
  },
  card: { backgroundColor: colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#eee" },
  businessName: { fontSize: 15, fontWeight: "700", color: colors.darkText },
  businessMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
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
