import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchDisputedEscrows,
  resolveEscrow,
  fetchPendingPayouts,
  processPayout,
  fetchFinanceSummary,
} from "../api/admin.api";

import AdminEscrowAuditLog from "../components/AdminEscrowAuditLog";

export default function Dashboard() {
  const queryClient = useQueryClient();

  /* =========================
     Queries
     ========================= */

  const {
    data: disputes,
    isLoading: disputesLoading,
    isError: disputesError,
  } = useQuery({
    queryKey: ["adminDisputes"],
    queryFn: fetchDisputedEscrows,
  });

  const {
    data: payouts,
    isLoading: payoutsLoading,
    isError: payoutsError,
  } = useQuery({
    queryKey: ["adminPayouts"],
    queryFn: fetchPendingPayouts,
  });

  const {
    data: finance,
    isLoading: financeLoading,
    isError: financeError,
  } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: fetchFinanceSummary,
  });

  /* =========================
     Mutations
     ========================= */

  const resolveMutation = useMutation({
    mutationFn: ({
      escrowId,
      action,
    }: {
      escrowId: number;
      action: "release" | "refund";
    }) => resolveEscrow(escrowId, action),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const payoutMutation = useMutation({
    mutationFn: ({
      payoutId,
      status,
    }: {
      payoutId: number;
      status: "completed" | "failed";
    }) => processPayout(payoutId, status),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  /* =========================
     Loading / Error
     ========================= */

  if (disputesLoading || payoutsLoading || financeLoading) {
    return <div style={{ padding: 24 }}>Loading admin dashboard…</div>;
  }

  if (disputesError || payoutsError || financeError) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Failed to load admin data.
      </div>
    );
  }

  /* =========================
     Render
     ========================= */

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>

      {/* ================= Disputed Escrows ================= */}

      <h2>Disputed Escrows</h2>

      {disputes?.length === 0 && <p>No active disputes.</p>}

      {disputes?.map((d) => (
        <div
          key={d.escrow_id}
          style={{
            border: "1px solid #dc3545",
            padding: 16,
            marginBottom: 16,
          }}
        >
          <p>
            <strong>{d.task_title}</strong>
          </p>
          <p>Amount: {d.amount} NAD</p>

          <button
            onClick={() =>
              resolveMutation.mutate({
                escrowId: d.escrow_id,
                action: "release",
              })
            }
          >
            Release to Finder
          </button>

          <button
            style={{ marginLeft: 8 }}
            onClick={() =>
              resolveMutation.mutate({
                escrowId: d.escrow_id,
                action: "refund",
              })
            }
          >
            Refund Client
          </button>

          {/* ===== Audit Log ===== */}
          <AdminEscrowAuditLog escrowId={d.escrow_id} />
        </div>
      ))}

      {/* ================= Pending Payouts ================= */}

      <h2 style={{ marginTop: 32 }}>Pending Payouts</h2>

      {payouts?.length === 0 && <p>No pending payouts.</p>}

      {payouts?.map((p) => (
        <div
          key={p.payout_id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 12,
          }}
        >
          <p>Recipient: {p.recipient}</p>
          <p>Amount: {p.amount} NAD</p>

          <button
            onClick={() =>
              payoutMutation.mutate({
                payoutId: p.payout_id,
                status: "completed",
              })
            }
          >
            Mark Completed
          </button>

          <button
            style={{ marginLeft: 8 }}
            onClick={() =>
              payoutMutation.mutate({
                payoutId: p.payout_id,
                status: "failed",
              })
            }
          >
            Mark Failed
          </button>
        </div>
      ))}

      {/* ================= Finance ================= */}

      <h2 style={{ marginTop: 32 }}>Finance Overview</h2>

      {finance && (
        <ul>
          <li>Total Revenue: {finance.total_revenue} NAD</li>
          <li>Monthly Revenue: {finance.monthly_revenue} NAD</li>
          <li>Completed Escrows: {finance.completed_escrows}</li>
        </ul>
      )}
    </div>
  );
}
