import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.api";

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
  maxWidth: 420,
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  marginBottom: 14,
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

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("busy_individual");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = await registerUser({
        name,
        email,
        password,
        role,
        phone,
      });

      localStorage.setItem(
        "rentfinder_auth",
        JSON.stringify(data)
      );

      // ✅ Redirect based on role
      if (data.user.role === "rent_finder") {
        navigate("/finder");
      } else {
        navigate("/busy");
      }

    } catch {
      alert("❌ Registration failed");
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
            style={{ height: 50 }}
          />
          <h3 style={{ margin: 0 }}>RentFinder</h3>
        </div>

        {/* ✅ DESCRIPTION */}
        <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          Join RentFinder to connect with rental seekers and finders.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          
          {/* NAME */}
          <input
            style={inputStyle}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          {/* PHONE */}
          <input
            style={inputStyle}
            placeholder="Phone (+264...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* ROLE */}
          <select
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="busy_individual">
              Busy Individual (Looking for a place)
            </option>
            <option value="rent_finder">
              Rent Finder (Helping others find rentals)
            </option>
          </select>

          {/* REGISTER BUTTON */}
          <button style={buttonStyle} type="submit">
            ✅ Create Account
          </button>
        </form>

        {/* ✅ LOGIN LINK */}
        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}