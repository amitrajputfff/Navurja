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
  // Settles in kilograms, not litres — the trade (and every downstream
  // rate card / certificate calculation) is priced per kg. This same
  // schema validates two different wire shapes: the browser form, where
  // a register()'d <input type="number"> always hands back a `string`
  // (z.coerce.number()'s `unknown` input type otherwise fights
  // react-hook-form's generic inference — see PickupFormInput below);
  // and the API route's JSON body, where `onSubmit`'s already-transformed
  // `values.oilQuantityKg` (a `number`) round-trips through
  // JSON.stringify/parse as a JSON number, not a string. The union
  // accepts either without weakening validation.
  oilQuantityKg: z
    .union([z.string(), z.number()])
    .transform((value) => (typeof value === "number" ? value : value.trim()))
    .refine((value) => value !== "" && !Number.isNaN(Number(value)), "Enter a valid number")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .positive("Enter an estimated quantity in kg")
        .max(100000, "That doesn't look right — enter kilograms, not litres")
    ),
  pickupLocation: z.string().trim().min(5, "Enter a pickup address"),
  pickupDate: z.date({ error: "Select a preferred pickup date" }).refine(
    (date) => date.getTime() >= new Date().setHours(0, 0, 0, 0),
    "Pickup date can't be in the past"
  ),
  message: z.string().trim().max(500, "Keep it under 500 characters").optional(),
});

// Output type (post-transform, e.g. oilQuantityKg as `number`) — what
// onSubmit receives and what the API route/DB deal with.
export type PickupFormValues = z.infer<typeof pickupFormSchema>;
// Input type (pre-transform, e.g. oilQuantityKg as `string`) — what
// register()'d fields actually hold. Needed as useForm's first generic so
// react-hook-form and the zod resolver agree on field types; see the note
// on `oilQuantityKg` above.
export type PickupFormInput = z.input<typeof pickupFormSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});
