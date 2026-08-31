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
import { createRateCard } from "@/app/admin/rate-cards/actions";
import { DeactivateButton } from "@/app/admin/rate-cards/deactivate-button";

export default async function AdminRateCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = getSupabaseServerClient();
  const { data: rateCards } = await supabase
    .from("rate_cards")
    .select("*")
    .order("active", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-xl font-bold text-nav-dark-text">Rate cards</h1>
        <p className="mt-1 text-sm text-nav-muted">
          City × segment × quality grade. Never hardcode a price elsewhere — collections read
          from here.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-nav-muted">
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">₹/kg</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(rateCards ?? []).map((rc) => (
                <tr key={rc.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">{rc.city}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{rc.segment}</Badge>
                  </td>
                  <td className="px-4 py-3 capitalize">{rc.quality_grade}</td>
                  <td className="px-4 py-3 font-medium">₹{rc.rate_per_kg}</td>
                  <td className="px-4 py-3">{rc.active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3 text-right">
                    {rc.active && <DeactivateButton id={rc.id} />}
                  </td>
                </tr>
              ))}
              {(rateCards ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-nav-muted">
                    No rate cards yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="h-fit p-6">
        <h2 className="text-sm font-bold text-nav-dark-text">New rate card</h2>
        <form action={createRateCard} className="mt-4 flex flex-col gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="segment">Segment</Label>
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
            <Label htmlFor="qualityGrade">Quality grade</Label>
            <Select name="qualityGrade" defaultValue="standard">
              <SelectTrigger id="qualityGrade" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ratePerKg">Rate (₹/kg)</Label>
            <Input
              id="ratePerKg"
              name="ratePerKg"
              type="number"
              step="0.5"
              min="0"
              required
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
}
