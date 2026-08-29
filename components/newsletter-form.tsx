"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema } from "@/lib/validations";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }
    setError(null);
    toast.success("You're subscribed. Thanks for joining NavUrja.");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <div className="flex items-center gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Email address"
          aria-invalid={!!error}
          className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20"
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-lg bg-nav-green text-nav-deep-green hover:bg-nav-light-green"
          aria-label="Subscribe"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-nav-oil-gold">{error}</p>}
    </form>
  );
}
