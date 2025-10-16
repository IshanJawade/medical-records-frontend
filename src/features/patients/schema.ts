import { z } from "zod";

export const PatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mrn: z.string().min(1, "MRN is required").max(64, "Max 64 chars"),
  dob: z.string().optional().or(z.literal("")),
  sex: z.string().min(1, "Sex is required").max(16, "Max 16 chars"),
  phone: z.string().min(1, "Phone is required").max(32, "Max 32 chars"),
  addressLine1: z.string().min(1, "Address Line 1 is required").max(160, "Max 160 chars"),
  addressLine2: z.string().max(160, "Max 160 chars").nullable().optional(),
  city: z.string().min(1, "City is required").max(80, "Max 80 chars"),
  state: z.string().min(1, "State is required").max(40, "Max 40 chars"),
  zip: z.string().min(1, "Zip is required").max(20, "Max 20 chars"),
});

export type PatientForm = z.infer<typeof PatientSchema>;
