import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceptionistSchema, type ReceptionistForm } from "../schema";
import { Stack, TextField } from "@mui/material";

export default function ReceptionistFormCmp({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<ReceptionistForm>;
  onSubmit: (data: ReceptionistForm) => void | Promise<void>;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
	useForm<ReceptionistForm>({
	  resolver: zodResolver(ReceptionistSchema),
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
		<TextField label="Phone" {...register("phone")} />
		<TextField label="Email" {...register("email")} />
		<input type="submit" hidden disabled={isSubmitting} />
	  </Stack>
	</form>
  );
}
