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
import { useRouter } from "expo-router";
import { apiPostPublic, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";

export default function SignupScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await apiPostPublic("/api/vendor/signup", {
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      // Account exists now — sign in immediately rather than sending them
      // back to a separate login screen for a password they just typed.
      const result = await signIn(email.trim(), password);
      if (result.error) {
        setError(`Account created, but sign-in failed: ${result.error}`);
        return;
      }
      router.replace("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong — try again");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = fullName.trim() && email.trim() && password.length >= 8;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>For restaurants, hotels, cloud kitchens, and caterers</Text>

        <View style={styles.form}>
          <Field label="Your name" value={fullName} onChangeText={setFullName} />
          <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Password (min. 8 characters)" value={password} onChangeText={setPassword} secureTextEntry />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }, !canSubmit && { opacity: 0.4 }]}
            onPress={handleSubmit}
            disabled={submitting || !canSubmit}
          >
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Create account</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  ...inputProps
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
} & Partial<React.ComponentProps<typeof TextInput>>) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.muted}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 28, paddingVertical: 48 },
  title: { fontSize: 22, fontWeight: "700", color: colors.darkText, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: "center", marginTop: 4, marginBottom: 28 },
  form: {},
  label: { fontSize: 13, fontWeight: "600", color: colors.darkText, marginBottom: 6 },
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
