import { createContext, useContext, useEffect, useState } from "react";

/**
 * ===============================
 * TYPES
 * ===============================
 */

type Role = "busy_individual" | "rent_finder" | "admin";

interface User {
  userId: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

/**
 * ===============================
 * CONTEXT SETUP
 * ===============================
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "rentfinder_auth";

/**
 * ===============================
 * PROVIDER
 * ===============================
 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /**
   * ✅ Load from localStorage on app start
   */
  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error("Failed to parse auth data");
      }
    }
  }, []);

  /**
   * ✅ Login
   */
  function login(token: string, user: User) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));

    setUser(user);
    setToken(token);
  }

  /**
   * ✅ Logout
   */
  function logout() {
    localStorage.removeItem(AUTH_KEY);

    setUser(null);
    setToken(null);
  }

  /**
   * ✅ Provide context
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ===============================
 * HOOK
 * ===============================
 */

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}