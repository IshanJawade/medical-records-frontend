import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema, type PatientForm } from "../schema";
import { Stack, TextField } from "@mui/material";

export default function PatientFormCmp({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<PatientForm>;
  onSubmit: (data: PatientForm) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: zodResolver(PatientSchema),
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
        <TextField
          label="MRN"
          {...register("mrn")}
          error={!!errors.mrn}
          helperText={errors.mrn?.message}
        />
        <TextField
          label="DOB"
          {...register("dob")}
          error={!!errors.dob}
          helperText={errors.dob?.message}
        />
        <TextField
          label="Sex"
          {...register("sex")}
          error={!!errors.sex}
          helperText={errors.sex?.message}
        />
        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <TextField
          label="Address Line 1"
          {...register("addressLine1")}
          error={!!errors.addressLine1}
          helperText={errors.addressLine1?.message}
        />
        <TextField
          label="Address Line 2"
          {...register("addressLine2")}
          error={!!errors.addressLine2}
          helperText={errors.addressLine2?.message}
        />
        <TextField
          label="City"
          {...register("city")}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
        <TextField
          label="State"
          {...register("state")}
          error={!!errors.state}
          helperText={errors.state?.message}
        />
        <TextField
          label="Zip"
          {...register("zip")}
          error={!!errors.zip}
          helperText={errors.zip?.message}
        />
      </Stack>
    </form>
  );
}