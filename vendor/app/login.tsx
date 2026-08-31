import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Image source={require("@/assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>NavUrja Partner</Text>
        <Text style={styles.subtitle}>Sign in to manage your pickups</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@business.com"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
            onPress={handleSubmit}
            disabled={submitting || !email || !password}
          >
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Sign in</Text>}
          </Pressable>
        </View>

        <Link href="/signup" asChild>
          <Pressable style={{ marginTop: 20 }}>
            <Text style={styles.signupLink}>
              New here? <Text style={styles.signupLinkBold}>Create an account</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  logo: { width: 56, height: 56, alignSelf: "center", marginBottom: 12, resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "700", color: colors.darkText, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: "center", marginTop: 4, marginBottom: 32 },
  form: { gap: 0 },
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
  error: { color: colors.destructive, fontSize: 13, marginTop: 14 },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: "600" },
  signupLink: { textAlign: "center", fontSize: 13, color: colors.muted },
  signupLinkBold: { color: colors.primary, fontWeight: "700" },
});
