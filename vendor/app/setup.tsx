import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiPost, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";
import { ChipSelect } from "@/components/chip-select";

const SEGMENTS = [
  "Restaurants",
  "Hotels",
  "Cloud Kitchens",
  "Caterers",
  "Food Businesses",
  "Commercial Kitchens",
] as const;

export default function SetupScreen() {
  const { refreshProfile, signOut } = useAuth();
  const [legalName, setLegalName] = useState("");
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>("Restaurants");
  const [city, setCity] = useState("");
  const [outletName, setOutletName] = useState("");
  const [outletAddress, setOutletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = legalName.trim() && city.trim() && outletName.trim() && outletAddress.trim();

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await apiPost("/api/vendor/onboarding", {
        legalName: legalName.trim(),
        segment,
        city: city.trim(),
        outletName: outletName.trim(),
        outletAddress: outletAddress.trim(),
      });
      await refreshProfile();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong — try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Tell us about your business</Text>
        <Text style={styles.subtitle}>One-time setup — you can add more outlets later.</Text>

        <Field label="Business name" value={legalName} onChangeText={setLegalName} placeholder="e.g. Spice Route Kitchen" />

        <Text style={styles.label}>Business type</Text>
        <View style={{ marginBottom: 16 }}>
          <ChipSelect options={SEGMENTS} value={segment} onChange={setSegment} />
        </View>

        <Field label="City" value={city} onChangeText={setCity} placeholder="e.g. Jaipur" />

        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>First outlet</Text>

        <Field label="Outlet name" value={outletName} onChangeText={setOutletName} placeholder="e.g. Main branch" />
        <Field label="Outlet address" value={outletAddress} onChangeText={setOutletAddress} placeholder="Full pickup address" />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }, !canSubmit && { opacity: 0.4 }]}
          onPress={handleSubmit}
          disabled={submitting || !canSubmit}
        >
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Continue</Text>}
        </Pressable>

        <Pressable onPress={signOut} style={{ marginTop: 16, alignSelf: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: "700", color: colors.darkText },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "600", color: colors.darkText, marginBottom: 6 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.darkText,
    backgroundColor: colors.white,
  },
  error: { color: colors.destructive, fontSize: 13, marginBottom: 8 },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: "600" },
});
