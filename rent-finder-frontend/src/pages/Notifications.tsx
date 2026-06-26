import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notifications.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * ===============================
   * LOAD NOTIFICATIONS
   * ===============================
   */
  useEffect(() => {
    async function loadNotifications() {
      if (!token) return;

      try {
        const data = await fetchNotifications(token);
        setNotifications(data);

        // ✅ show toast for new unread notifications
        data.forEach((n: any) => {
          if (!n.is_read) {
            toast.success(n.message);
          }
        });

      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [token]);

  /**
   * ===============================
   * MARK ONE AS READ
   * ===============================
   */
  async function handleMarkAsRead(
    e: React.MouseEvent,
    id: number
  ) {
    e.stopPropagation(); // ✅ Prevent navigation when clicking button

    if (!token) return;

    await markAsRead(id, token);

    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === id ? { ...n, is_read: true } : n
      )
    );
  }

  /**
   * ===============================
   * MARK ALL AS READ
   * ===============================
   */
  async function handleMarkAll() {
    if (!token) return;

    await markAllAsRead(token);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  }



  /**
   * ===============================
   * UI
   * ===============================
   */
  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      <button
        onClick={handleMarkAll}
        style={{ marginBottom: "10px" }}
      >
        Mark all as read
      </button>

      {loading && <p>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p>No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
  key={n.notification_id}
  onClick={async () => {
    if (!token) return;

    try {
      // ✅ 1. Mark as read IF not already
      if (!n.is_read) {
        await markAsRead(n.notification_id, token);

        // ✅ Update UI instantly
        setNotifications((prev) =>
          prev.map((item) =>
            item.notification_id === n.notification_id
              ? { ...item, is_read: true }
              : item
          )
        );

        // ✅ Update bell instantly
        const { notifyAll } = await import("../utils/notificationEvents");
        notifyAll();
      }

      // ✅ 2. Navigate AFTER marking
      if (n.link) {
        navigate(n.link);
      }

    } catch (err) {
      console.error("Notification click error:", err);
    }
  }}
  style={{
    padding: "10px",
    marginBottom: "8px",
    border: "1px solid #ccc",
    backgroundColor: n.is_read ? "#f5f5f5" : "#e6f3ff",
    cursor: n.link ? "pointer" : "default",
  }}
>
          <p>{n.message}</p>

          <small>
            {new Date(n.created_at).toLocaleString("en-NA", {
              timeZone: "Africa/Windhoek", // ⏰ Namibia timezone
            })}
          </small>

          {!n.is_read && (
            <div>
              <button
                onClick={(e) =>
                  handleMarkAsRead(e, n.notification_id)
                }
              >
                Mark as read
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
