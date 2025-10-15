import { z } from "zod";

export const ReceptionsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
});
export type ReceptionsForm = z.infer<typeof ReceptionsSchema>;
