import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

type OnboardingState = {
  /** null while the AsyncStorage read is in flight. */
  seen: boolean | null;
  markSeen: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setSeen(value === "true"))
      .catch(() => setSeen(false));
  }, []);

  async function markSeen() {
    setSeen(true);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // Worst case the intro shows again next launch — not worth failing over.
    }
  }

  return (
    <OnboardingContext.Provider value={{ seen, markSeen }}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
