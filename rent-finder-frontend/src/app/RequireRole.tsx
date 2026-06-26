import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Role = "busy_individual" | "rent_finder" | "admin";

interface RequireRoleProps {
  role: Role;
  children: ReactNode;
}

export default function RequireRole({
  role,
  children,
}: RequireRoleProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;

}