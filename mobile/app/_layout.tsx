import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { OnboardingProvider, useOnboarding } from "@/lib/onboarding-context";

// Keep the native splash up until both the auth check and the
// onboarding-seen check have resolved — called at module scope, before
// anything renders, per expo-router's documented pattern.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <RootNavigator />
      </OnboardingProvider>
    </AuthProvider>
  );
}

// This app's own roles — the ones the mobile screens are actually built
// for (see MOBILE_ROLES in ../lib/mobile-auth.ts on the backend). Not the
// same list as the web admin console's staff-role gate, which is for the
// opposite set of people (deliberately excludes collector).
const STAFF_ROLES = ["collector", "sales_exec", "hub_operator", "admin"];

function RootNavigator() {
  const { session, profile, loading: authLoading } = useAuth();
  const { seen: onboardingSeen } = useOnboarding();

  const ready = !authLoading && onboardingSeen !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Splash screen is still covering the app at this point — render
  // nothing rather than a loading spinner that would flash underneath it.
  if (!ready) return null;

  const showOnboarding = !onboardingSeen;
  const isStaff = !!profile && STAFF_ROLES.includes(profile.role);
  const authenticated = !!session && isStaff;
  // Deliberately not `!!profile && !isStaff` — a session can exist with
  // `profile` still null because the backend is unreachable, not because
  // the account genuinely lacks a staff role. Bucketing both cases here
  // (rather than falling through to the plain login screen) means a
  // network hiccup shows an explanatory retry screen instead of silently
  // bouncing back to login with no error, as if the password were wrong.
  const signedInNotStaff = !!session && !authenticated;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={showOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={!showOnboarding && authenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!showOnboarding && signedInNotStaff}>
        <Stack.Screen name="not-authorized" />
      </Stack.Protected>
      <Stack.Protected guard={!showOnboarding && !authenticated && !signedInNotStaff}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
