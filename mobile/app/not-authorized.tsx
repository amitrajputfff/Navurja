import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/theme";

export default function NotAuthorizedScreen() {
  const { profile, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Not authorized</Text>
      <Text style={styles.body}>
        {profile?.email ?? "This account"} is signed in but doesn&apos;t have a staff role on
        NavUrja Ops.
      </Text>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, backgroundColor: colors.background },
  title: { fontSize: 18, fontWeight: "700", color: colors.darkText, marginBottom: 8 },
  body: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
  buttonText: { color: colors.white, fontWeight: "600" },
});
