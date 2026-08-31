import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { BUSINESS_TYPE_OPTIONS } from "@/lib/constants";
import { createOrganization } from "@/app/admin/organizations/actions";

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = getSupabaseServerClient();
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, legal_name, segment, city, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-xl font-bold text-nav-dark-text">Organizations</h1>
        <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(orgs ?? []).map((org) => (
                <tr key={org.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/organizations/${org.id}`}
                      className="font-medium text-nav-dark-text underline"
                    >
                      {org.legal_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{org.segment}</Badge>
                  </td>
                  <td className="px-4 py-3">{org.city}</td>
                  <td className="px-4 py-3 capitalize">{org.status}</td>
                </tr>
              ))}
              {(orgs ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-nav-muted">
                    No organizations yet — convert a lead or add one directly.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="h-fit p-6">
        <h2 className="text-sm font-bold text-nav-dark-text">New organization</h2>
        <form action={createOrganization} className="mt-4 flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="legalName">Business name</Label>
            <Input id="legalName" name="legalName" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="segment">Segment</Label>
            {/* Base UI's Select.Root renders its own hidden input for
                `name`, so this posts with the plain <form action> below
                same as any other native field — no controller needed. */}
            <Select name="segment" defaultValue={BUSINESS_TYPE_OPTIONS[0]}>
              <SelectTrigger id="segment" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ownerPhone">Owner phone</Label>
            <Input id="ownerPhone" name="ownerPhone" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ownerEmail">Owner email</Label>
            <Input id="ownerEmail" name="ownerEmail" type="email" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="outletAddress">First outlet address</Label>
            <Input id="outletAddress" name="outletAddress" required className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}
