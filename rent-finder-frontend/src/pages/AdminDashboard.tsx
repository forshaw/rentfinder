import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDisputedEscrows,
  resolveEscrow,
  fetchPendingPayouts,
  processPayout,
  fetchFinanceSummary,
  fetchPaymentProofs,
  verifyPayment,
  fetchAnalytics,
} from "../api/admin.api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =========================
   ✅ STYLES
========================= */

const sectionTitle = {
  marginTop: 40,
  marginBottom: 14,
  fontSize: 18,
  fontWeight: 600,
};

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  padding: 16,
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const buttonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  color: "#fff",
};

const successButton = {
  ...buttonStyle,
  backgroundColor: "#28a745",
};

const dangerButton = {
  ...buttonStyle,
  backgroundColor: "#dc3545",
};

/* =========================
   ✅ COMPONENT
========================= */

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  /* ✅ DATA */
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });

  const { data: finance } = useQuery({
    queryKey: ["financeSummary"],
    queryFn: fetchFinanceSummary,
  });

  const { data: disputes } = useQuery({
    queryKey: ["adminDisputes"],
    queryFn: fetchDisputedEscrows,
  });

  const { data: payouts } = useQuery({
    queryKey: ["adminPayouts"],
    queryFn: fetchPendingPayouts,
  });

  const { data: proofs } = useQuery({
    queryKey: ["paymentProofs"],
    queryFn: fetchPaymentProofs,
  });

  /* ✅ MUTATIONS (FIXED) */
  const resolveMutation = useMutation({
    mutationFn: ({
      escrowId,
      action,
    }: {
      escrowId: number;
      action: "release" | "refund";
    }) => resolveEscrow(escrowId, action),

    onSuccess: () => queryClient.invalidateQueries(),
  });

  const payoutMutation = useMutation({
    mutationFn: ({
      payoutId,
      status,
    }: {
      payoutId: number;
      status: "completed" | "failed";
    }) => processPayout(payoutId, status),

    onSuccess: () => queryClient.invalidateQueries(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({
      escrowId,
      action,
    }: {
      escrowId: number;
      action: "approve" | "reject";
    }) => verifyPayment(escrowId, action),

    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <div>

      {/* ✅ MAIN HEADER */}
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
        📊 Admin Dashboard
      </h1>

      {/* ================= ANALYTICS ================= */}
      <h2 style={sectionTitle}>📈 Platform Analytics</h2>

      {analytics && (
        <>
          {/* ✅ GRID CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div style={cardStyle}>
              <strong>Total Requests</strong>
              <p>{analytics.total_requests}</p>
            </div>

            <div style={cardStyle}>
              <strong>Active Tasks</strong>
              <p>{analytics.active_tasks}</p>
            </div>

            <div style={cardStyle}>
              <strong>Completed Escrows</strong>
              <p>{analytics.completed_escrows}</p>
            </div>

            <div style={cardStyle}>
              <strong>Total Revenue</strong>
              <p>{analytics.total_revenue} NAD</p>
            </div>
          </div>

          {/* ✅ CHART INSIDE CARD */}
          {analytics.monthly_stats?.length > 0 && (
            <div style={{ ...cardStyle, marginTop: 20 }}>
              <h3 style={{ marginBottom: 12 }}>📈 Monthly Revenue</h3>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analytics.monthly_stats}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#007bff"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= FINANCE ================= */}
      <h2 style={sectionTitle}>💰 Finance Overview</h2>

      {finance && (
        <div style={{ display: "flex", gap: 16 }}>
          <div style={cardStyle}>
            <strong>Total Revenue</strong>
            <p>{finance.total_revenue} NAD</p>
          </div>

          <div style={cardStyle}>
            <strong>Monthly Revenue</strong>
            <p>{finance.monthly_revenue} NAD</p>
          </div>

          <div style={cardStyle}>
            <strong>Completed Escrows</strong>
            <p>{finance.completed_escrows}</p>
          </div>
        </div>
      )}

      {/* ================= DISPUTES ================= */}
      <h2 style={sectionTitle}>⚠️ Disputed Escrows</h2>

      {disputes?.length === 0 && (
        <p style={{ color: "#777" }}>No active disputes</p>
      )}

      {disputes?.map((d: any) => (
        <div key={d.escrow_id} style={{ ...cardStyle, marginTop: 10 }}>
          <h3>{d.task_title}</h3>
          <p>{d.amount} NAD</p>

          <div style={{ marginTop: 10 }}>
            <button
              style={successButton}
              onClick={() =>
                resolveMutation.mutate({
                  escrowId: d.escrow_id,
                  action: "release",
                })
              }
            >
              ✅ Release
            </button>

            <button
              style={{ ...dangerButton, marginLeft: 8 }}
              onClick={() =>
                resolveMutation.mutate({
                  escrowId: d.escrow_id,
                  action: "refund",
                })
              }
            >
              ❌ Refund
            </button>
          </div>
        </div>
      ))}

      {/* ================= PAYOUTS ================= */}
      <h2 style={sectionTitle}>💸 Pending Payouts</h2>

      {payouts?.length === 0 && (
        <p style={{ color: "#777" }}>No pending payouts</p>
      )}

      {payouts?.map((p: any) => (
        <div key={p.payout_id} style={{ ...cardStyle, marginTop: 10 }}>
          <p><strong>{p.recipient}</strong></p>
          <p>{p.amount} NAD</p>

          <div style={{ marginTop: 10 }}>
            <button
              style={successButton}
              onClick={() =>
                payoutMutation.mutate({
                  payoutId: p.payout_id,
                  status: "completed",
                })
              }
            >
              ✅ Completed
            </button>

            <button
              style={{ ...dangerButton, marginLeft: 8 }}
              onClick={() =>
                payoutMutation.mutate({
                  payoutId: p.payout_id,
                  status: "failed",
                })
              }
            >
              ❌ Failed
            </button>
          </div>
        </div>
      ))}

      {/* ================= PAYMENTS ================= */}
      <h2 style={sectionTitle}>💳 Payment Verifications</h2>

      {proofs?.length === 0 && (
        <p style={{ color: "#777" }}>No pending verifications</p>
      )}

      {proofs?.map((p: any) => (
        <div key={p.escrow_id} style={{ ...cardStyle, marginTop: 10 }}>
          <p><strong>{p.user_name}</strong></p>
          <p>{p.amount} NAD</p>

          {p.proof_url && (
            <img
              src={p.proof_url}
              alt="Proof"
              style={{ maxWidth: 200, marginTop: 10 }}
            />
          )}

          <div style={{ marginTop: 10 }}>
            <button
              style={successButton}
              onClick={() =>
                verifyMutation.mutate({
                  escrowId: p.escrow_id,
                  action: "approve",
                })
              }
            >
              ✅ Approve
            </button>

            <button
              style={{ ...dangerButton, marginLeft: 8 }}
              onClick={() =>
                verifyMutation.mutate({
                  escrowId: p.escrow_id,
                  action: "reject",
                })
              }
            >
              ❌ Reject
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}