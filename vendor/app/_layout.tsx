import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/lib/auth-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const VENDOR_ROLES = ["fbo_owner", "fbo_staff"];

function RootNavigator() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  // Splash screen is still covering the app at this point.
  if (loading) return null;

  const isVendor = !!profile && VENDOR_ROLES.includes(profile.role);
  const authenticated = !!session && isVendor;
  // Same "not authenticated" bucket whether profile is null because the
  // account genuinely isn't a vendor account, or because the backend was
  // briefly unreachable — see not-authorized.tsx for how it's disambiguated.
  const signedInNotVendor = !!session && !authenticated;
  const needsSetup = authenticated && !profile?.org_id;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={authenticated && !needsSetup}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={needsSetup}>
        <Stack.Screen name="setup" />
      </Stack.Protected>
      <Stack.Protected guard={signedInNotVendor}>
        <Stack.Screen name="not-authorized" />
      </Stack.Protected>
      <Stack.Protected guard={!authenticated && !signedInNotVendor}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>
    </Stack>
  );
}
