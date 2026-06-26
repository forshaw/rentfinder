import { useState, useEffect } from "react";
import type { AuthUser } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userJson = localStorage.getItem("auth_user");

    if (token && userJson) {
      setUser(JSON.parse(userJson));
    }

    setLoading(false);
  }, []);

  function login(token: string, user: AuthUser) {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}