"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type GeocodeResult = {
  label: string;
  lat: number;
  lng: number;
  city: string | null;
  state: string | null;
};

/**
 * Free-text address input with India-restricted suggestions from
 * OpenStreetMap (via /api/geocode — see that route for why it's proxied).
 * Always stays a plain editable text field: picking a suggestion just
 * fills it, typing past what OSM knows is never blocked.
 */
export function AddressAutocomplete({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  ariaInvalid,
  ariaDescribedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  // Selecting a suggestion sets `value` too, which would otherwise
  // immediately re-trigger this same effect and search for the address
  // we just picked.
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const query = value.trim();
    if (query.length < 3) return; // shrinking back below 3 chars is handled in handleInputChange

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = (await response.json()) as { results?: GeocodeResult[] };
        const next = data.results ?? [];
        setResults(next);
        setOpen(next.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [value]);

  function handleInputChange(newValue: string) {
    onChange(newValue);
    if (newValue.trim().length < 3) {
      setResults([]);
      setOpen(false);
      setLoading(false);
    }
  }

  function handleSelect(result: GeocodeResult) {
    skipNextSearchRef.current = true;
    onChange(result.label);
    setResults([]);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <Input
            id={id}
            autoComplete="off"
            placeholder={placeholder}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={onBlur}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
          />
        }
      />
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-(--anchor-width) p-1"
        // Base UI auto-focuses the popup content when it opens by default
        // (right for a menu, wrong for a combobox) — that's exactly what
        // was pulling focus out of the input the moment suggestions
        // appeared. Keep focus in the input; suggestions are still
        // clickable without it.
        initialFocus={false}
      >
        {loading && (
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-nav-muted">
            <Loader2 className="size-3.5 animate-spin" />
            Searching...
          </div>
        )}
        {!loading &&
          results.map((result, index) => (
            <button
              key={`${result.lat}-${result.lng}-${index}`}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
            >
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-nav-muted" />
              <span className="line-clamp-2">{result.label}</span>
            </button>
          ))}
      </PopoverContent>
    </Popover>
  );
}
