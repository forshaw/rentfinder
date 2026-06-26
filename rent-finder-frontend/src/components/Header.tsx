import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [, setMenuOpen] = useState(false);

  if (!user) return null;

  const currentUser = user;

  function goToDashboard() {
    setMenuOpen(false);

    if (currentUser.role === "admin") {
      navigate("/admin");
    } else if (currentUser.role === "rent_finder") {
      navigate("/finder");
    } else {
      navigate("/busy");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #e0e0e0",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ✅ LEFT: BRAND */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/logo.png"
              alt="RentFinder"
              style={{
                height: 50,
                width: "auto",
              }}
            />

            <span style={{ fontWeight: 600, fontSize: 18 }}>
              RentFinder
            </span>
          </div>

        {/* ✅ RIGHT: ACTIONS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* 🔔 Notifications */}
          <NotificationBell />

          {/* Dashboard */}
          <button
            onClick={goToDashboard}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "none",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "none",
              background: "#dc3545",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}