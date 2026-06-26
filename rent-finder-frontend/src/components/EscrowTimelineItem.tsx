import type { EscrowTimelineEvent } from "../types/escrow";

export default function EscrowTimelineItem({
  event,
}: {
  event: EscrowTimelineEvent;
}) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <strong>{event.description}</strong>

      <div style={{ fontSize: 12, color: "#666" }}>
        {new Date(event.created_at).toLocaleString()}
      </div>

      {event.amount !== null && (
        <div style={{ marginTop: 4 }}>
          Amount: <strong>{event.amount} NAD</strong>
        </div>
      )}
    </div>
  );
}