/**
 * ===============================
 * AUTH API (BACKEND ONLY VERSION)
 * ===============================
 * ✅ No test mode
 * ✅ Always uses backend
 * ✅ Matches your Express API
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  role: "busy_individual" | "rent_finder" | "admin";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/**
 * ✅ LOGIN USER (REAL BACKEND)
 */
export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {
  const res = await fetch("https://rentfinder-vxp1.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      errorText || "Login failed. Please check your credentials."
    );
  }

  const data = await res.json();
  return data;
}

/**
 * (Optional for later)
 * ✅ REGISTER USER (REAL BACKEND)
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}) {
  const res = await fetch("https://rentfinder-vxp1.onrender.com/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}
