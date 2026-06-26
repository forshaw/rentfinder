/**
 * ===============================
 * NOTIFICATIONS API
 * ===============================
 * ✅ Requires JWT token
 */

/**
 * ✅ Get all notifications
 */
export async function fetchNotifications(token: string) {
  const res = await fetch("http://localhost:3000/api/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
}

/**
 * ✅ Get unread count
 */
export async function fetchUnreadCount(token: string) {
  const res = await fetch(
    "http://localhost:3000/api/notifications/unread-count",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch unread count");
  }

  const data = await res.json();
  return data.unreadCount;
}

/**
 * ✅ Mark one notification as read
 */
export async function markAsRead(id: number, token: string) {
  const res = await fetch(
    `http://localhost:3000/api/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return res.json();
}

/**
 * ✅ Mark all notifications as read
 */
export async function markAllAsRead(token: string) {
  const res = await fetch(
    "http://localhost:3000/api/notifications/mark-all-read",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return res.json();
}