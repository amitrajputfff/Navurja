"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadStatus } from "@/app/admin/leads/actions";

const STATUSES = ["new", "contacted", "converted", "dead"] as const;

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(async () => {
          await updateLeadStatus(leadId, value);
        });
      }}
    >
      <SelectTrigger className="h-8 w-32 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
