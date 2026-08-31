import { Card } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase-server";

async function getStats() {
  const supabase = getSupabaseServerClient();

  const [newLeads, orgs, collectionsThisMonth] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("organizations").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("collections")
      .select("net_kg, net_payable")
      .gte("collected_at", new Date(new Date().setDate(1)).toISOString()),
  ]);

  const kgThisMonth =
    collectionsThisMonth.data?.reduce((sum, row) => sum + Number(row.net_kg ?? 0), 0) ?? 0;
  const payoutThisMonth =
    collectionsThisMonth.data?.reduce((sum, row) => sum + Number(row.net_payable ?? 0), 0) ?? 0;

  return {
    newLeads: newLeads.count ?? 0,
    activeOrgs: orgs.count ?? 0,
    kgThisMonth,
    payoutThisMonth,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const tiles = [
    { label: "New leads", value: stats.newLeads.toLocaleString("en-IN") },
    { label: "Active organizations", value: stats.activeOrgs.toLocaleString("en-IN") },
    { label: "Kg collected this month", value: stats.kgThisMonth.toLocaleString("en-IN") },
    {
      label: "Payable this month",
      value: `₹${stats.payoutThisMonth.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-nav-dark-text">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-nav-muted">
              {tile.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-nav-dark-text">{tile.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
