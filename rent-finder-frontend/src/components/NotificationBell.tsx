import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUnreadCount } from "../api/notifications.api";
import { useNavigate } from "react-router-dom";
import { subscribe } from "../utils/notificationEvents";

export default function NotificationBell() {
  const { token } = useAuth();
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      if (!token) return;

      try {
        const unread = await fetchUnreadCount(token);

        // ✅ prevent state update if component unmounts
        if (isMounted) {
          setCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch unread count");
      }
    }

    // ✅ initial load
    loadCount();

    // ✅ subscribe to event updates
    const callback = () => loadCount();
    const unsubscribe = subscribe(callback);

    // ✅ cleanup (VERY IMPORTANT)
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [token]);

  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => navigate("/notifications")}
    >
      <span style={{ fontSize: "24px" }}>🔔</span>

      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}