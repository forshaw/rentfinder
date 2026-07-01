const API_BASE = (
  import.meta.env.VITE_API_URL || "https://rentfinder-vxp1.onrender.com"
).replace(/\/+$/, "");

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("auth_token");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_BASE}${cleanPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}