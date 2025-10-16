import { api } from "../../api/client";
import type { LoginPayload, LoginResponse, UserRole } from "./types";

const ENDPOINTS: Record<UserRole, string> = {
  doctor: "/auth/doctor/login",
  patient: "/auth/patient/login",
  reception: "/auth/reception/login",
};

export const AuthAPI = {
  login: async (role: UserRole, payload: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post(ENDPOINTS[role], payload);
    return res.data as LoginResponse;
  },

  // tiny helpers to persist session for testing
  saveSession: (role: UserRole, data: LoginResponse) => {
    localStorage.setItem("auth.role", role);
    localStorage.setItem("auth.token", data.token);
    localStorage.setItem("auth.user", JSON.stringify(data.user));
  },
  clearSession: () => {
    localStorage.removeItem("auth.role");
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.user");
  },
  getSession: () => {
    const role = localStorage.getItem("auth.role") as UserRole | null;
    const token = localStorage.getItem("auth.token");
    const userRaw = localStorage.getItem("auth.user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { role, token, user };
  },
};
