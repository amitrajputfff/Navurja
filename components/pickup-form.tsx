"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Eye,
  Leaf,
} from "lucide-react";
import { toast } from "sonner";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Reveal } from "@/components/reveal";
import { BUSINESS_TYPE_OPTIONS } from "@/lib/constants";
import { pickupFormSchema, type PickupFormValues } from "@/lib/validations";

const HIGHLIGHTS = [
  { label: "Easy pickup", icon: Truck },
  { label: "Safe & compliant", icon: ShieldCheck },
  { label: "Transparent process", icon: Eye },
  { label: "Real environmental impact", icon: Leaf },
];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

/** Decorative oil droplet + ripple rings, matching the reference layout's
 * left-column visual. Pure SVG/CSS — no new dependency. */
function OilDroplet() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-4 left-0 z-0 hidden w-28 lg:block"
    >
      <svg viewBox="0 0 160 220" className="relative h-auto w-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]">
        <defs>
          <linearGradient id="pickupDropletGradient" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#f4dd9a" />
            <stop offset="55%" stopColor="#c9963f" />
            <stop offset="100%" stopColor="#6f5019" />
          </linearGradient>
        </defs>
        <path
          d="M80 8C118 62 150 108 150 148c0 41-31 68-70 68S10 189 10 148C10 108 42 62 80 8Z"
          fill="url(#pickupDropletGradient)"
        />
        <ellipse cx="56" cy="115" rx="13" ry="20" fill="white" opacity="0.3" />
      </svg>
      <div className="absolute -bottom-3 left-1/2 h-3 w-52 -translate-x-1/2 rounded-[50%] border border-white/10" />
      <div className="absolute -bottom-7 left-1/2 h-4 w-64 -translate-x-1/2 rounded-[50%] border border-white/5" />
    </div>
  );
}

/** Frontend-only for now; swap the body for a real API/server action call
 * once the backend is ready — the signature (takes the validated payload,
 * resolves or throws) is already what a real request would look like, so
 * every caller-side concern (error state, focus, toast) is already wired
 * for it. Not currently logging `values` anywhere, unlike the previous
 * implementation, which shipped a raw console.log of user PII. */
async function submitPickupRequest(values: PickupFormValues): Promise<void> {
  void values;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error("Simulated network failure"));
        return;
      }
      resolve();
    }, 700);
  });
}

export function PickupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<PickupFormValues>({
    resolver: zodResolver(pickupFormSchema),
  });

  async function onSubmit(values: PickupFormValues) {
    try {
      await submitPickupRequest(values);
      toast.success("Pickup request received. We'll be in touch shortly.");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong — please try again.", {
        description: "If this keeps happening, email hello@navurja.com directly.",
      });
    }
  }

  function onInvalid(fieldErrors: typeof errors) {
    const firstField = Object.keys(fieldErrors)[0] as keyof PickupFormValues | undefined;
    if (firstField) setFocus(firstField);
  }

  return (
    <section id="pickup" className="relative overflow-hidden bg-nav-deep-green py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-nav-green/20 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <Reveal className="relative pb-16 text-center lg:pb-36 lg:text-left">
          <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.2em] text-nav-oil-gold">
            Ready to close the loop?
          </p>
          <h2 className="relative z-10 mt-3 text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-white">
            Let&apos;s build a <span className="text-nav-green">cleaner</span>,
            <br />
            greener future <span className="text-nav-green">together</span>.
          </h2>

          <ul className="relative z-10 mx-auto mt-7 flex max-w-xs flex-col gap-3 lg:mx-0">
            {HIGHLIGHTS.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 text-left">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-nav-green/20 text-nav-green">
                  <Icon className="size-3.5" strokeWidth={2.25} />
                </span>
                <span className="text-sm font-medium text-white/85">{label}</span>
              </li>
            ))}
          </ul>

          <OilDroplet />
        </Reveal>

        <Reveal delay={0.1} className="rounded-3xl bg-card p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="size-10 text-nav-green" />
              <p className="text-lg font-semibold text-nav-dark-text">
                Request received
              </p>
              <p className="max-w-sm text-sm text-nav-muted">
                Our team will reach out to confirm your pickup details soon.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => setSubmitted(false)}
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-nav-dark-text">Schedule a Pickup</h3>
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                noValidate
                className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                    className="mt-1.5"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  <FieldError id="name" message={errors.name?.message} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="mt-1.5"
                    placeholder="Your phone number"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    {...register("phone")}
                  />
                  <FieldError id="phone" message={errors.phone?.message} />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="mt-1.5"
                    placeholder="Your email address"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  <FieldError id="email" message={errors.email?.message} />
                </div>

                <div>
                  <Label htmlFor="businessName">Business / Organization</Label>
                  <Input
                    id="businessName"
                    autoComplete="organization"
                    className="mt-1.5"
                    placeholder="Your business name"
                    aria-invalid={!!errors.businessName}
                    aria-describedby={errors.businessName ? "businessName-error" : undefined}
                    {...register("businessName")}
                  />
                  <FieldError id="businessName" message={errors.businessName?.message} />
                </div>

                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    autoComplete="street-address"
                    className="mt-1.5"
                    placeholder="Your address or area"
                    aria-invalid={!!errors.pickupLocation}
                    aria-describedby={errors.pickupLocation ? "pickupLocation-error" : undefined}
                    {...register("pickupLocation")}
                  />
                  <FieldError id="pickupLocation" message={errors.pickupLocation?.message} />
                </div>

                <div>
                  <Label htmlFor="oilQuantity">Estimated Oil Quantity</Label>
                  <Input
                    id="oilQuantity"
                    className="mt-1.5"
                    placeholder="e.g. 10L, 20L"
                    aria-invalid={!!errors.oilQuantity}
                    aria-describedby={errors.oilQuantity ? "oilQuantity-error" : undefined}
                    {...register("oilQuantity")}
                  />
                  <FieldError id="oilQuantity" message={errors.oilQuantity?.message} />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Controller
                    control={control}
                    name="businessType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="businessType"
                          className="mt-1.5 w-full"
                          aria-invalid={!!errors.businessType}
                        >
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError id="businessType" message={errors.businessType?.message} />
                </div>

                <div>
                  <Label htmlFor="pickupDate">Preferred Pickup Date</Label>
                  <Controller
                    control={control}
                    name="pickupDate"
                    render={({ field }) => (
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger
                          render={
                            <Button
                              id="pickupDate"
                              type="button"
                              variant="outline"
                              aria-invalid={!!errors.pickupDate}
                              className="mt-1.5 w-full justify-start text-left font-normal"
                            />
                          }
                        >
                          <CalendarIcon className="size-4" />
                          {field.value ? format(field.value, "PPP") : "Select a date"}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDateOpen(false);
                            }}
                            disabled={{ before: new Date() }}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  <FieldError id="pickupDate" message={errors.pickupDate?.message} />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    className="mt-1.5"
                    placeholder="Any additional information..."
                    rows={3}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    {...register("message")}
                  />
                  <FieldError id="message" message={errors.message?.message} />
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-5 text-base"
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Pickup"}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
