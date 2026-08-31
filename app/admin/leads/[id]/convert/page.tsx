import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { convertLeadToOrganization } from "@/app/admin/leads/actions";

export default async function ConvertLeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = getSupabaseServerClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();
  if (!lead) notFound();

  const convertAction = convertLeadToOrganization.bind(null, lead.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold text-nav-dark-text">Convert lead to organization</h1>
      <Card className="mt-6 p-6">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-nav-muted">Business</dt>
            <dd className="font-medium">{lead.business_name}</dd>
          </div>
          <div>
            <dt className="text-xs text-nav-muted">Type</dt>
            <dd className="font-medium">{lead.business_type}</dd>
          </div>
          <div>
            <dt className="text-xs text-nav-muted">Contact</dt>
            <dd className="font-medium">
              {lead.name} · {lead.phone}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-nav-muted">Address</dt>
            <dd className="font-medium">{lead.pickup_location}</dd>
          </div>
        </dl>

        <form action={convertAction} className="mt-6 flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required placeholder="e.g. Jaipur" className="mt-1.5" />
            <p className="mt-1 text-xs text-nav-muted">
              Not captured on the pickup form — confirm it here so the outlet can be assigned a
              rate card and a route.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Create organization &amp; outlet
          </Button>
        </form>
      </Card>
    </div>
  );
}
