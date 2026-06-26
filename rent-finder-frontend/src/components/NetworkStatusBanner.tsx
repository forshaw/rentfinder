import { useEffect, useState } from "react";

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [visible, setVisible] = useState(!navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setVisible(true);

      // Auto-hide after a short delay when back online
      setTimeout(() => setVisible(false), 3000);
    }

    function handleOffline() {
      setIsOnline(false);
      setVisible(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        background: isOnline ? "#d4edda" : "#f8d7da",
        color: isOnline ? "#155724" : "#721c24",
        padding: "8px 16px",
        textAlign: "center",
        fontSize: 14,
      }}
    >
      {isOnline
        ? "You are back online"
        : "You are offline. Some features may be unavailable."}
    </div>
  );
}
