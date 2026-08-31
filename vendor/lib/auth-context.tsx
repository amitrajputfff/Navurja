import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { apiGet } from "@/lib/api";
import type { Organization } from "@/lib/types";

export type Profile = {
  role: "admin" | "city_manager" | "sales_exec" | "hub_operator" | "collector" | "fbo_owner" | "fbo_staff";
  full_name: string | null;
  phone: string | null;
  org_id: string | null;
  active: boolean;
  email: string | null;
};

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  organization: Organization | null;
  /** Set when the last profile fetch failed — distinguishes "couldn't
   * reach the backend" from "this account genuinely has no vendor
   * access". Same reasoning as the ops app's auth-context. */
  profileError: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const { user, organization } = await apiGet<{ user: Profile; organization: Organization | null }>(
        "/api/vendor/me"
      );
      setProfile(user);
      setOrganization(organization);
      setProfileError(null);
    } catch (e) {
      setProfile(null);
      setOrganization(null);
      setProfileError(
        e instanceof Error ? e.message : "Couldn't reach NavUrja — check your connection"
      );
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await loadProfile();
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await loadProfile();
      } else {
        setProfile(null);
        setOrganization(null);
        setProfileError(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        organization,
        profileError,
        loading,
        signIn,
        signOut,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
