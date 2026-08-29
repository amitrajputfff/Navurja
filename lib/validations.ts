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
    .regex(INDIAN_PHONE_REGEX, "Enter a valid Indian phone number"),
  email: z.email("Enter a valid email address"),
  oilQuantity: z.string().trim().min(1, "Approx. quantity is required"),
  pickupLocation: z.string().trim().min(5, "Enter a pickup address"),
  pickupDate: z.date({ error: "Select a preferred pickup date" }).refine(
    (date) => date.getTime() >= new Date().setHours(0, 0, 0, 0),
    "Pickup date can't be in the past"
  ),
});

export type PickupFormValues = z.infer<typeof pickupFormSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address"),
});
