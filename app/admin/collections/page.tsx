import { Card } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { CollectionForm } from "@/app/admin/collections/collection-form";

// Without generated Supabase types, postgrest-js can't tell an embedded
// many-to-one relation (outlet -> its one organization) from a
// one-to-many, so it types every embed as an array. `one()` picks the
// single row out of whichever shape actually comes back at runtime.
function one<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

type OutletOrgRow = {
  id: string;
  name: string;
  city: string;
  organizations: { legal_name: string; segment: string } | { legal_name: string; segment: string }[] | null;
};

type CollectionRow = {
  id: string;
  collected_at: string;
  net_kg: number;
  rate_per_kg: number;
  net_payable: number;
  quality_grade: string;
  outlets:
    | { name: string; organizations: { legal_name: string } | { legal_name: string }[] | null }
    | { name: string; organizations: { legal_name: string } | { legal_name: string }[] | null }[]
    | null;
};

export default async function AdminCollectionsPage() {
  const supabase = getSupabaseServerClient();

  const [{ data: outletRows }, { data: rateCards }, { data: collections }] = await Promise.all([
    supabase
      .from("outlets")
      .select("id, name, city, organizations(legal_name, segment)")
      .eq("status", "active")
      .order("name")
      .overrideTypes<OutletOrgRow[], { merge: false }>(),
    supabase.from("rate_cards").select("city, segment, quality_grade, rate_per_kg").eq("active", true),
    supabase
      .from("collections")
      .select("id, collected_at, net_kg, rate_per_kg, net_payable, quality_grade, outlets(name, organizations(legal_name))")
      .order("collected_at", { ascending: false })
      .limit(30)
      .overrideTypes<CollectionRow[], { merge: false }>(),
  ]);

  const outlets = (outletRows ?? []).map((o) => {
    const org = one(o.organizations);
    return {
      id: o.id,
      name: o.name,
      city: o.city,
      org_legal_name: org?.legal_name ?? "—",
      org_segment: org?.segment ?? "",
    };
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-xl font-bold text-nav-dark-text">Collections</h1>
        <p className="mt-1 text-sm text-nav-muted">
          The ledger. Every recorded pickup, however it was entered.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Outlet</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Net kg</th>
                <th className="px-4 py-3">Rate/kg</th>
                <th className="px-4 py-3">Payable</th>
              </tr>
            </thead>
            <tbody>
              {(collections ?? []).map((c) => {
                const outlet = one(c.outlets);
                const org = outlet ? one(outlet.organizations) : undefined;
                return (
                  <tr key={c.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(c.collected_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {org?.legal_name} — {outlet?.name}
                    </td>
                    <td className="px-4 py-3 capitalize">{c.quality_grade}</td>
                    <td className="px-4 py-3">{c.net_kg}</td>
                    <td className="px-4 py-3">₹{c.rate_per_kg}</td>
                    <td className="px-4 py-3 font-medium">₹{c.net_payable}</td>
                  </tr>
                );
              })}
              {(collections ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-nav-muted">
                    No collections recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="h-fit p-6">
        <h2 className="text-sm font-bold text-nav-dark-text">Record a collection</h2>
        <div className="mt-4">
          <CollectionForm outlets={outlets} rateCards={rateCards ?? []} />
        </div>
      </Card>
    </div>
  );
}
