import { z } from "zod";

export const ReceptionistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
});
export type ReceptionistForm = z.infer<typeof ReceptionistSchema>;
