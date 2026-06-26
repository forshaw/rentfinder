import { useQuery } from "@tanstack/react-query";
import { fetchEscrowTimeline } from "../api/escrow.api";
import EscrowTimelineItem from "./EscrowTimelineItem";

export default function EscrowTimeline({ escrowId }: { escrowId: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["escrowTimeline", escrowId],
    queryFn: () => fetchEscrowTimeline(escrowId),
  });

  if (isLoading) {
    return <div>Loading escrow timeline...</div>;
  }

  if (isError) {
    return <div>Failed to load escrow timeline.</div>;
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Escrow Timeline</h4>

      {data?.length === 0 && (
        <div>No escrow activity yet.</div>
      )}

      {data?.map((event, idx) => (
        <EscrowTimelineItem key={idx} event={event} />
      ))}
    </div>
  );
}