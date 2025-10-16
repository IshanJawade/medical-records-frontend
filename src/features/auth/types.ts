export type UserRole = "doctor" | "patient" | "reception";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    name: string;
    role: UserRole;
    email?: string | null;
  };
}
