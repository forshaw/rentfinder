import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth.api";

/* =========================
   ✅ STYLES
========================= */

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#f4f6f8",
};

const cardStyle = {
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  marginBottom: 16,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: 10,
  border: "none",
  borderRadius: 6,
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

/* =========================
   ✅ COMPONENT
========================= */

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ email, password });

      login(data.token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (data.user.role === "rent_finder") {
        navigate("/finder", { replace: true });
      } else {
        navigate("/busy", { replace: true });
      }
    } catch {
      setError("❌ The login information you entered is incorrect.");
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* ✅ TITLE */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src="/logo.png"
              alt="RentFinder"
              style={{
                height: 50,
                marginBottom: 6,
              }}
            />
            <h3 style={{ margin: 0 }}>RentFinder</h3>
          </div>

        {/* ✅ WELCOME TEXT */}
        <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          Find your next rental faster with trusted finders.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          
          {error && (
            <p style={{ color: "red", marginBottom: 10 }}>
              {error}
            </p>
          )}

          {/* EMAIL */}
          <input
            style={inputStyle}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* LOGIN BUTTON */}
          <button style={buttonStyle} type="submit">
            🔐 Login
          </button>
        </form>

        {/* ✅ REGISTER LINK */}
        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "#007bff" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
