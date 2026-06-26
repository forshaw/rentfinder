import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path;

  const itemStyle = (path: string) => ({
    flex: 1,
    textAlign: "center" as const,
    padding: "8px 0",
    color: isActive(path) ? "#007bff" : "#555",
    fontSize: 12,
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        zIndex: 1000,
      }}
    >
      <div
        style={itemStyle("/busy")}
        onClick={() => navigate("/busy")}
      >
        📊
        <div>Dashboard</div>
      </div>

      {/* ✅ ONLY BUSY USER */}
      {user?.role === "busy_individual" && (
        <div
          style={itemStyle("/create-request")}
          onClick={() => navigate("/create-request")}
        >
          ➕
          <div>New</div>
        </div>
      )}

      <div
        style={itemStyle("/notifications")}
        onClick={() => navigate("/notifications")}
      >
        🔔
        <div>Alerts</div>
      </div>
    </div>
  );
}
