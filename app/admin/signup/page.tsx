"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpStaff } from "@/app/admin/actions";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "city_manager", label: "City Manager" },
  { value: "sales_exec", label: "Sales Executive" },
  { value: "hub_operator", label: "Hub Operator" },
] as const;

export default function AdminSignupPage() {
  const [role, setRole] = useState<string>("admin");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    formData.set("role", role);
    const result = await signUpStaff(formData);
    // A successful call redirects server-side and never returns here.
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-xl font-bold text-nav-dark-text">Create a staff account</h1>
      <p className="mt-1 text-sm text-nav-muted">
        Requires the invite code shared with you out-of-band.
      </p>
      <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <Label htmlFor="inviteCode">Invite code</Label>
          <Input id="inviteCode" name="inviteCode" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value) => value && setRole(value)}>
            <SelectTrigger id="role" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
