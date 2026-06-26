import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  requestNotificationPermission,
  subscribeToPush,
} from "../utils/pushNotifications";

export default function EnableNotificationsButton() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);

  if (!user || enabled) return null;

 async function handleEnable() {
  const allowed = await requestNotificationPermission();
  if (!allowed) return;

  if (!user) {
    console.error("❌ No user found");
    return;
  }

  await subscribeToPush(user.userId);

  setEnabled(true); // ✅ THIS LINE IS REQUIRED
}

  return (
    <button onClick={handleEnable}>
      Enable Notifications
    </button>
  );
}
