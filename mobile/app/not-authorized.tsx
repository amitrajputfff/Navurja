import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";

export default function NotAuthorizedScreen() {
  const { profile, profileError, signOut, refreshProfile } = useAuth();
  const [retrying, setRetrying] = useState(false);

  // profileError means the backend was unreachable (not that this account
  // genuinely lacks access) — a session with no profile and no error only
  // happens transiently, so treat it the same as a connection problem
  // rather than showing a hard "not authorized".
  const isConnectionIssue = !!profileError || !profile;

  async function handleRetry() {
    setRetrying(true);
    await refreshProfile();
    setRetrying(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isConnectionIssue ? "Couldn't connect" : "Not authorized"}</Text>
      <Text style={styles.body}>
        {isConnectionIssue
          ? "Signed in, but couldn't reach NavUrja to load your account. Check your connection and try again."
          : `${profile?.email ?? "This account"} is signed in but doesn't have a staff role on NavUrja Ops.`}
      </Text>

      {isConnectionIssue && (
        <Pressable style={styles.retryButton} onPress={handleRetry} disabled={retrying}>
          {retrying ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>Retry</Text>
          )}
        </Pressable>
      )}
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, backgroundColor: colors.background },
  title: { fontSize: 18, fontWeight: "700", color: colors.darkText, marginBottom: 8 },
  body: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 20 },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 10,
    minWidth: 100,
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: { color: colors.white, fontWeight: "600" },
  signOutText: { color: colors.darkText, fontWeight: "600" },
});
