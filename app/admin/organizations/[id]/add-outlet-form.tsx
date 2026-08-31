"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOutlet } from "@/app/admin/organizations/actions";

export function AddOutletForm({ orgId }: { orgId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    const result = await addOutlet(orgId, formData);
    setIsSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <div>
        <Label htmlFor="outletName">Outlet name</Label>
        <Input id="outletName" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="outletAddress">Address</Label>
        <Input id="outletAddress" name="address" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="outletCity">City</Label>
        <Input id="outletCity" name="city" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="outletContactName">Contact name</Label>
        <Input id="outletContactName" name="contactName" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="outletContactPhone">Contact phone</Label>
        <Input id="outletContactPhone" name="contactPhone" className="mt-1.5" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isSubmitting} size="sm">
        {isSubmitting ? "Adding..." : "Add outlet"}
      </Button>
    </form>
  );
}
