import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const itemStyle = (path: string) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: isActive(path) ? 600 : 400,
    background: isActive(path) ? "#e7f0ff" : "transparent",
    color: isActive(path) ? "#007bff" : "#333",
  });

  return (
    <div
      style={{
        width: 220,
        padding: "20px 12px",
        borderRight: "1px solid #eee",
        background: "transparent",
        flexShrink: 0,
      }}
    >
      {/* ✅ Dashboard */}
      <div
        style={itemStyle("/busy")}
        onClick={() => navigate("/busy")}
      >
        📊 Dashboard
      </div>

      {/* ✅ ONLY FOR BUSY USERS */}
      {user?.role === "busy_individual" && (
        <div
          style={itemStyle("/create-request")}
          onClick={() => navigate("/create-request")}
        >
          ➕ New Request
        </div>
      )}

      {/* ✅ Notifications */}
      <div
        style={itemStyle("/notifications")}
        onClick={() => navigate("/notifications")}
      >
        🔔 Notifications
      </div>
    </div>
  );
}