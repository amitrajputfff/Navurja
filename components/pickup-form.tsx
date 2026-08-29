"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Reveal } from "@/components/reveal";
import { BUSINESS_TYPE_OPTIONS } from "@/lib/constants";
import { pickupFormSchema, type PickupFormValues } from "@/lib/validations";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-nav-oil-gold">{message}</p>;
}

export function PickupForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PickupFormValues>({
    resolver: zodResolver(pickupFormSchema),
  });

  async function onSubmit(values: PickupFormValues) {
    // Frontend-only for now; swap this for a real API/server action call
    // once the backend is ready. Keeping it isolated makes that a one-line change.
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log("Pickup request submitted:", values);
    toast.success("Pickup request received. We'll be in touch shortly.");
    setSubmitted(true);
    reset();
  }

  return (
    <section id="pickup" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <h2 className="text-balance text-[clamp(1.875rem,2.5vw+1rem,3rem)] font-bold tracking-tight text-nav-dark-text">
            Ready to close the loop?
          </h2>
          <p className="mt-4 text-lg text-nav-muted">
            Schedule a used cooking oil pickup in a few simple steps.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="glass mt-12 rounded-3xl p-6 sm:p-10">
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
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="mt-1.5" {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" className="mt-1.5" {...register("businessName")} />
                <FieldError message={errors.businessName?.message} />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Controller
                  control={control}
                  name="businessType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="businessType" className="mt-1.5 w-full">
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
                <FieldError message={errors.businessType?.message} />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="mt-1.5"
                  placeholder="98765 43210"
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label htmlFor="oilQuantity">Approx. Oil Quantity</Label>
                <Input
                  id="oilQuantity"
                  className="mt-1.5"
                  placeholder="e.g. 25 kg / week"
                  {...register("oilQuantity")}
                />
                <FieldError message={errors.oilQuantity?.message} />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  className="mt-1.5"
                  placeholder="Address, area, city"
                  {...register("pickupLocation")}
                />
                <FieldError message={errors.pickupLocation?.message} />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="pickupDate">Preferred Pickup Date</Label>
                <Controller
                  control={control}
                  name="pickupDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            id="pickupDate"
                            type="button"
                            variant="outline"
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
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError message={errors.pickupDate?.message} />
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-nav-primary py-5 text-base text-white hover:bg-nav-deep-green sm:w-auto"
                >
                  {isSubmitting ? "Submitting..." : "Request Pickup"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
