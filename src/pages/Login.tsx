import { useMemo, useState } from "react";
import {
  Box, Card, CardContent, CardHeader, Typography, ToggleButtonGroup, ToggleButton,
  TextField, Button, Alert, Stack, Link as MLink
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginForm } from "../features/auth/schema";
import { LoginSchema } from "../features/auth/schema";
import type { UserRole } from "../features/auth/types";
import { useLogin } from "../features/auth/hooks";
import { Link, useNavigate } from "react-router-dom";

const RoleLabel: Record<UserRole, string> = {
  doctor: "Doctor",
  patient: "Patient",
  reception: "Reception",
};

export default function LoginPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) });

  const loginMutation = useLogin(role ?? "doctor"); // default won’t be used until role set

  const canSubmit = useMemo(() => !!role && !loginMutation.isPending, [role, loginMutation.isPending]);

  const onSubmit = (data: LoginForm) => {
    if (!role) return;
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Go somewhere convenient after login; tweak as you like
        if (role === "doctor") navigate("/doctors");
        else if (role === "patient") navigate("/patients");
        else navigate("/receptions");
      },
    });
  };

  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 64px)" }}>
      <Card sx={{ width: 420, maxWidth: "95vw" }}>
        <CardHeader
          title="Sign in"
          subheader="Choose a role to test each model’s login"
          sx={{ textAlign: "center", pb: 0 }}
        />
        <CardContent>
          {/* Step 1: Role selection */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ToggleButtonGroup
              exclusive
              value={role}
              onChange={(_, v) => setRole(v)}
              aria-label="role"
            >
              <ToggleButton value="doctor" aria-label="doctor">Doctor</ToggleButton>
              <ToggleButton value="patient" aria-label="patient">Patient</ToggleButton>
              <ToggleButton value="reception" aria-label="reception">Reception</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {!role && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Pick a role to continue.
            </Alert>
          )}

          {/* Step 2: Credentials */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    label={role ? `${RoleLabel[role]} Email` : "Email"}
                    placeholder="name@company.com"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                  />
                )}
              />

              {loginMutation.isError && (
                <Alert severity="error">
                  {loginMutation.error?.message || "Login failed"}
                </Alert>
              )}

              {loginMutation.isSuccess && (
                <Alert severity="success">
                  Logged in as {loginMutation.data.user.name} ({loginMutation.data.user.role})
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
              >
                {loginMutation.isPending ? "Signing in…" : "Sign in"}
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Just testing? Use your seeded/demo accounts.{" "}
                <MLink component={Link} to="/" underline="hover">Back to home</MLink>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
