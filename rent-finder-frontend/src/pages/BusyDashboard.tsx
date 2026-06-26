import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchMyTasks,
  cancelEscrow,
  verifyTask,
} from "../api/tasks.api";

import { fetchMyRequests } from "../api/requests.api";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

/* =========================
   ✅ STYLES
========================= */

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  backgroundColor: "#fff",
};

const buttonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

const dangerButton = {
  ...buttonStyle,
  backgroundColor: "#dc3545",
};

/* =========================
   ✅ COMPONENT
========================= */

export default function BusyDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"tasks" | "requests">("tasks");

  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "verify";
    id: number;
  } | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  /* =========================
     DATA
  ========================= */

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: fetchMyTasks,
  });

  const { data: myRequests } = useQuery({
    queryKey: ["myRequests"],
    queryFn: fetchMyRequests,
  });

  /* =========================
     MUTATIONS
  ========================= */

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelEscrow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      setToast("✅ Escrow cancelled");
    },
    onError: () => setToast("❌ Cancel failed"),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: number) => verifyTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      setToast("✅ Task verified");
    },
    onError: () => setToast("❌ Verification failed"),
  });

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;

  /* =========================
     UI
  ========================= */

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 900, width: "100%", padding: 32 }}>
        
        {/* ✅ TITLE */}
        <h1 style={{ marginBottom: 10, fontSize: 24 }}>📊 Busy dashboard</h1>

        {/* ✅ TABS */}
        <div
          style={{
            display: "flex",
            gap: 20,
            borderBottom: "1px solid #ddd",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setActiveTab("tasks")}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "tasks"
                  ? "2px solid #007bff"
                  : "none",
              paddingBottom: 8,
              cursor: "pointer",
            }}
          >
            📦 Tasks
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "requests"
                  ? "2px solid #007bff"
                  : "none",
              paddingBottom: 8,
              cursor: "pointer",
            }}
          >
            🏘️ Requests
          </button>
        </div>

        {/* ================= TASKS ================= */}
        {activeTab === "tasks" && (
          <>
            {tasks?.length === 0 && <p>No tasks yet</p>}

            {tasks?.map((task: any) => {
              const escrow = task.escrow_payment;

              return (
                <div
                  key={task.task_id}
                  style={{ ...cardStyle, textAlign: "left" }}
                >
                  <h3 style={{ marginBottom: 6 }}>
                    📦 Task No:{task.task_id}
                  </h3>

                  <p style={{ marginBottom: 6 }}>
                    <strong>Escrow:</strong>{" "}
                    <StatusBadge status={escrow?.status || "unknown"} />
                  </p>

                  <p style={{ marginBottom: 10 }}>
                    <strong>Amount:</strong>{" "}
                    {escrow?.total_amount || 0} NAD
                  </p>

                  {/* ✅ FUND (BANK TRANSFER) */}
                  {escrow?.status === "pending" && (
                    <button
                      style={buttonStyle}
                      onClick={() =>
                        navigate(`/bank-transfer/${escrow.escrow_id}`)
                      }
                    >
                      💳 Fund via Bank Transfer
                    </button>
                  )}

                  {/* ✅ VERIFY + CANCEL */}
                  {escrow?.status === "held" && (
                    <div style={{ marginTop: 10 }}>
                      <button
                        style={buttonStyle}
                        onClick={() =>
                          setConfirmAction({
                            type: "verify",
                            id: task.task_id,
                          })
                        }
                      >
                        ✅ Verify
                      </button>

                      <button
                        style={{
                          ...dangerButton,
                          marginLeft: 8,
                        }}
                        onClick={() =>
                          setConfirmAction({
                            type: "cancel",
                            id: escrow.escrow_id,
                          })
                        }
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}

                  {escrow?.status === "released" && (
                    <p style={{ color: "green", marginTop: 10, fontSize: 12 }}>
                      ✅ Payment released
                    </p>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ================= REQUESTS ================= */}
        {activeTab === "requests" && (
          <>
            {myRequests?.length === 0 && (
              <p>No requests yet</p>
            )}

            {myRequests?.map((req: any) => (
              <div
                key={req.request_id}
                style={{ ...cardStyle, textAlign: "left" }}
              >
                <h3 style={{ marginBottom: 6 }}>
                  Location: {req.location}
                </h3>

                <p style={{ marginBottom: 6 }}>
                  <strong>Budget:</strong> {req.budget} NAD
                </p>

                <p style={{ marginBottom: 6 }}>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={req.status || "unknown"} />
                </p>

                {req.tasks?.[0] && (
                  <div style={{ marginTop: 10 }}>
                    <p>Finder: {req.tasks[0].users?.name}</p>
                    <p>Phone: {req.tasks[0].users?.phone_number}</p>

                    <p>
                      Escrow:{" "}
                      <StatusBadge
                          status={req.tasks?.[0]?.escrow_payment?.status || "unknown"}
                        />
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ✅ CONFIRM */}
        <ConfirmDialog
          open={confirmAction !== null}
          title="Confirm Action"
          message="Are you sure?"
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => {
            if (!confirmAction) return;

            if (confirmAction.type === "cancel") {
              cancelMutation.mutate(confirmAction.id);
            }

            if (confirmAction.type === "verify") {
              verifyMutation.mutate(confirmAction.id);
            }

            setConfirmAction(null);
          }}
        />

        {/* ✅ TOAST */}
        {toast && (
          <Toast message={toast} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}