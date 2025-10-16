import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "./api";
import type { LoginPayload, LoginResponse, UserRole } from "./types";

export const useLogin = (role: UserRole) =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => AuthAPI.login(role, payload),
    onSuccess: (data) => {
      AuthAPI.saveSession(role, data);
    },
  });
