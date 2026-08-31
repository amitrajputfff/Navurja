import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { AddOutletForm } from "@/app/admin/organizations/[id]/add-outlet-form";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const [{ data: org }, { data: outlets }] = await Promise.all([
    supabase.from("organizations").select("*").eq("id", id).single(),
    supabase.from("outlets").select("*").eq("org_id", id).order("created_at"),
  ]);
  if (!org) notFound();

  const outletIds = (outlets ?? []).map((o) => o.id);
  const { data: collections } = outletIds.length
    ? await supabase
        .from("collections")
        .select("id, collected_at, net_kg, rate_per_kg, net_payable, outlet_id")
        .in("outlet_id", outletIds)
        .order("collected_at", { ascending: false })
        .limit(20)
    : { data: [] };

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-nav-dark-text">{org.legal_name}</h1>
        <Badge variant="secondary">{org.segment}</Badge>
        <Badge variant="outline" className="capitalize">
          {org.status}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-nav-muted">
        {org.city} · {org.owner_phone ?? "no phone on file"} ·{" "}
        {org.owner_email ?? "no email on file"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-sm font-bold text-nav-dark-text">Outlets</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Cadence</th>
                  </tr>
                </thead>
                <tbody>
                  {(outlets ?? []).map((outlet) => (
                    <tr key={outlet.id} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3 font-medium">{outlet.name}</td>
                      <td className="px-4 py-3">{outlet.address}</td>
                      <td className="px-4 py-3">
                        {outlet.contact_name ?? "—"}
                        {outlet.contact_phone ? ` · ${outlet.contact_phone}` : ""}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {outlet.pickup_cadence.replace("_", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-nav-dark-text">Recent collections</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Net kg</th>
                    <th className="px-4 py-3">Rate/kg</th>
                    <th className="px-4 py-3">Payable</th>
                  </tr>
                </thead>
                <tbody>
                  {(collections ?? []).map((c) => (
                    <tr key={c.id} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-3">
                        {new Date(c.collected_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">{c.net_kg}</td>
                      <td className="px-4 py-3">₹{c.rate_per_kg}</td>
                      <td className="px-4 py-3">₹{c.net_payable}</td>
                    </tr>
                  ))}
                  {(collections ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-nav-muted">
                        No collections recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <Card className="h-fit p-6">
          <h2 className="text-sm font-bold text-nav-dark-text">Add outlet</h2>
          <div className="mt-4">
            <AddOutletForm orgId={org.id} />
          </div>
        </Card>
      </div>
    </div>
  );
}
