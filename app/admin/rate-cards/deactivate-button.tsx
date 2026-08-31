"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deactivateRateCard } from "@/app/admin/rate-cards/actions";

export function DeactivateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deactivateRateCard(id);
        })
      }
    >
      Deactivate
    </Button>
  );
}
