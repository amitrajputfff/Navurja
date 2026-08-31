import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

// (tabs) holds the three-tab home experience; collect/[id] is pushed on
// top of it as a full-screen form (tab bar hidden while it's open, which
// is the right feel for a focused data-entry flow).
export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.darkText,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
