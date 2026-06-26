import type { EscrowStatus } from "../types/tasks";

const STATUS_COLORS: Record<string, string> = {
  pending: "#999",
  held: "#007bff",
  released: "#28a745",
  cancelled: "#6c757d",
  disputed: "#dc3545",
  accepted: "#17a2b8",
  verified: "#28a745",
  unknown: "#6c757d",
};

export default function StatusBadge({
  status,
}: {
  status?: EscrowStatus | string;
}) {
  const safeStatus = status || "unknown";

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        backgroundColor:
          STATUS_COLORS[safeStatus] || "#6c757d",
        color: "#fff",
        fontSize: 12,
      }}
    >
      {(safeStatus || "unknown").toUpperCase()}
    </span>
  );
}
