import { getSupabaseServerAuthClient } from "@/lib/supabase/server-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { SignOutButton } from "@/app/admin/sign-out-button";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminSiteHeader } from "@/app/admin/admin-site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authClient = await getSupabaseServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // The login/signup pages render inside this same layout tree but need
  // none of the staff-gated chrome below.
  if (!user) return <>{children}</>;

  const supabase = getSupabaseServerClient();
  const { data: profile } = await supabase
    .from("app_users")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const isStaff =
    profile && ["admin", "city_manager", "sales_exec", "hub_operator"].includes(profile.role);

  if (!isStaff) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-lg font-bold text-nav-dark-text">Not authorized</h1>
        <p className="mt-2 text-sm text-nav-muted">
          {user.email} is signed in but has no staff role on the NavUrja admin console.
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: profile.full_name ?? "",
          email: user.email ?? "",
          role: profile.role,
        }}
      />
      <SidebarInset>
        <AdminSiteHeader />
        <main className="flex-1 bg-nav-mint px-6 py-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
