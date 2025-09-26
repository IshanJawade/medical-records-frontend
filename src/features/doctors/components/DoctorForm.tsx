import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoctorSchema, type DoctorForm } from "../schema";
import { Stack, TextField } from "@mui/material";

export default function DoctorFormCmp({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<DoctorForm>;
  onSubmit: (data: DoctorForm) => void | Promise<void>;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<DoctorForm>({
      resolver: zodResolver(DoctorSchema),
      defaultValues,
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ pt: 1 }}>
        <TextField
          label="Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          autoFocus
        />
        <TextField label="NPI" {...register("npi")} />
        <TextField label="Phone" {...register("phone")} />
        <TextField label="Specialty" {...register("specialty")} />
        <input type="submit" hidden disabled={isSubmitting} />
      </Stack>
    </form>
  );
}
