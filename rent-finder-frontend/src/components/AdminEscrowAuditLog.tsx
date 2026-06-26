import { useQuery } from "@tanstack/react-query";
import type { EscrowAuditLog } from "../types/audit";
import { fetchEscrowAuditLog } from "../api/adminAudit.api";

interface Props {
  escrowId: number;
}

export default function AdminEscrowAuditLog({ escrowId }: Props) {
  const { data, isLoading, isError } = useQuery<EscrowAuditLog[]>({
    queryKey: ["escrowAuditLog", escrowId],
    queryFn: () => fetchEscrowAuditLog(escrowId),
  });

  if (isLoading) {
    return <p>Loading audit log…</p>;
  }

  if (isError) {
    return <p style={{ color: "red" }}>Failed to load audit log.</p>;
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h4>Escrow Audit Log</h4>

      {data?.length === 0 && <p>No activity recorded.</p>}

      <ul style={{ paddingLeft: 16 }}>
        {data?.map((log) => (
          <li key={log.id} style={{ marginBottom: 8 }}>
            <strong>{log.action}</strong> — {log.actor}
            <br />
            {log.amount !== null && (
              <span>Amount: {log.amount} NAD</span>
            )}
            <br />
            <small>
              {new Date(log.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
