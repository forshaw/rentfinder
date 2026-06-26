import { useEffect, useState } from "react";

export default function PwaUpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onUpdate() {
      setVisible(true);
    }

    window.addEventListener("pwa-update-available", onUpdate);
    return () => {
      window.removeEventListener("pwa-update-available", onUpdate);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        background: "#fff3cd",
        color: "#856404",
        padding: "8px 16px",
        textAlign: "center",
        fontSize: 14,
      }}
    >
      A new version is available.
      <button
        style={{ marginLeft: 8 }}
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  );
}
