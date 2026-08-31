"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCollection } from "@/app/admin/collections/actions";

type Outlet = {
  id: string;
  name: string;
  city: string;
  org_legal_name: string;
  org_segment: string;
};

type RateCard = {
  city: string;
  segment: string;
  quality_grade: string;
  rate_per_kg: number;
};

export function CollectionForm({
  outlets,
  rateCards,
}: {
  outlets: Outlet[];
  rateCards: RateCard[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [outletId, setOutletId] = useState<string>(outlets[0]?.id ?? "");
  const [qualityGrade, setQualityGrade] = useState("standard");
  const [rate, setRate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOutlet = useMemo(
    () => outlets.find((o) => o.id === outletId),
    [outlets, outletId]
  );

  const suggestedRate = useMemo(() => {
    if (!selectedOutlet) return null;
    const match = rateCards.find(
      (rc) =>
        rc.city === selectedOutlet.city &&
        rc.segment === selectedOutlet.org_segment &&
        rc.quality_grade === qualityGrade
    );
    return match?.rate_per_kg ?? null;
  }, [selectedOutlet, rateCards, qualityGrade]);

  function handleOutletChange(id: string | null) {
    if (id) setOutletId(id);
  }

  function applySuggestedRate() {
    if (suggestedRate != null) setRate(String(suggestedRate));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    const result = await createCollection(formData);
    setIsSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
    setRate("");
  }

  if (outlets.length === 0) {
    return (
      <p className="text-sm text-nav-muted">
        No outlets yet — onboard an organization first.
      </p>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="outletId">Outlet</Label>
        <Select name="outletId" value={outletId} onValueChange={handleOutletChange}>
          <SelectTrigger id="outletId" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {outlets.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.org_legal_name} — {o.name} ({o.city})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="netKg">Net kg</Label>
        <Input
          id="netKg"
          name="netKg"
          type="number"
          step="0.1"
          min="0"
          required
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="qualityGrade">Quality grade</Label>
        <Select
          name="qualityGrade"
          value={qualityGrade}
          onValueChange={(value) => value && setQualityGrade(value)}
        >
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
        <div className="flex items-center justify-between">
          <Label htmlFor="ratePerKg">Rate (₹/kg)</Label>
          {suggestedRate != null && (
            <button
              type="button"
              onClick={applySuggestedRate}
              className="text-xs font-medium text-nav-green underline"
            >
              Use rate card: ₹{suggestedRate}
            </button>
          )}
        </div>
        <Input
          id="ratePerKg"
          name="ratePerKg"
          type="number"
          step="0.5"
          min="0"
          required
          className="mt-1.5"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="paymentMode">Payment mode</Label>
        <Select name="paymentMode" defaultValue="cash">
          <SelectTrigger id="paymentMode" className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank">Bank transfer</SelectItem>
            <SelectItem value="credit_note">Credit note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" rows={2} className="mt-1.5" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Recording..." : "Record collection"}
      </Button>
    </form>
  );
}
