import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { LeadStatusSelect } from "@/app/admin/leads/lead-status-select";

export default async function AdminLeadsPage() {
  const supabase = getSupabaseServerClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-xl font-bold text-nav-dark-text">Leads</h1>
      <p className="mt-1 text-sm text-nav-muted">
        Everything submitted through the website pickup form and newsletter.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Est. kg</th>
              <th className="px-4 py-3">Pickup date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => (
              <tr key={lead.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-nav-muted">
                  {new Date(lead.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-nav-dark-text">{lead.business_name}</td>
                <td className="px-4 py-3">
                  <div>{lead.name}</div>
                  <div className="text-xs text-nav-muted">
                    {lead.phone} · {lead.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{lead.business_type}</Badge>
                </td>
                <td className="px-4 py-3">{lead.oil_quantity_kg ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.pickup_date
                    ? new Date(lead.pickup_date).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {lead.status === "converted" && lead.converted_org_id ? (
                    <Link
                      href={`/admin/organizations/${lead.converted_org_id}`}
                      className="text-xs font-medium text-nav-green underline"
                    >
                      View org
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/leads/${lead.id}/convert`}
                      className="text-xs font-medium text-nav-green underline"
                    >
                      Convert
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {(leads ?? []).length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-nav-muted">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
