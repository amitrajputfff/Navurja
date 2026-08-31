import { z } from "zod";
import { BUSINESS_TYPE_OPTIONS } from "@/lib/constants";

const INDIAN_PHONE_REGEX = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const pickupFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  businessName: z.string().trim().min(2, "Enter your business name"),
  businessType: z.enum(BUSINESS_TYPE_OPTIONS, {
    error: "Select a business type",
  }),
  phone: z
    .string()
    .trim()
    // Strip spaces/hyphens before matching — the field's own placeholder
    // ("98765 43210") is a spaced number, and the regex only ever allowed a
    // space after a "+91" prefix, so the UI was suggesting input it would
    // then reject.
    .transform((value) => value.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(INDIAN_PHONE_REGEX, "Enter a valid Indian phone number")),
  email: z.email("Enter a valid email address"),
  oilQuantity: z.string().trim().min(1, "Approx. quantity is required"),
  pickupLocation: z.string().trim().min(5, "Enter a pickup address"),
  pickupDate: z.date({ error: "Select a preferred pickup date" }).refine(
    (date) => date.getTime() >= new Date().setHours(0, 0, 0, 0),
    "Pickup date can't be in the past"
  ),
  message: z.string().trim().max(500, "Keep it under 500 characters").optional(),
});

export type PickupFormValues = z.infer<typeof pickupFormSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});
