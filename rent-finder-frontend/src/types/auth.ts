export type UserRole = "busy_individual" | "rent_finder" | "admin";

export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}