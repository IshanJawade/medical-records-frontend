import { z } from "zod";

export const DoctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  npi: z.string().max(32, "Max 32 chars").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  specialty: z.string().optional().or(z.literal("")), // <-- specialty
});
export type DoctorForm = z.infer<typeof DoctorSchema>;
