import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchAvailableRequests,
  acceptRequest,
  fetchMyTasks,
  completeTask,
} from "../api/finder.api";

import StatusBadge from "../components/StatusBadge";

/* =========================
   ✅ REUSABLE STYLES
========================= */

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  backgroundColor: "#fff",
  maxWidth: 700,
};

const buttonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};


const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#ccc",
  cursor: "not-allowed",
};

/* =========================
   ✅ COMPONENT
========================= */

export default function FinderDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    "requests" | "tasks"
  >("tasks");

  /* =========================
     DATA
  ========================= */

  const { data: requests, isLoading, isError } =
    useQuery({
      queryKey: ["availableRequests"],
      queryFn: fetchAvailableRequests,
    });

  const { data: tasks } = useQuery({
    queryKey: ["finderTasks"],
    queryFn: fetchMyTasks,
  });

  /* =========================
     MUTATIONS
  ========================= */

  const acceptMutation = useMutation({
    mutationFn: (requestId: number) =>
      acceptRequest(requestId),
    onSuccess: () => {
      alert("✅ Request accepted");
      queryClient.invalidateQueries({
        queryKey: ["availableRequests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["finderTasks"],
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (taskId: number) =>
      completeTask(taskId),
    onSuccess: () => {
      alert("✅ Task completed");
      queryClient.invalidateQueries({
        queryKey: ["finderTasks"],
      });
    },
  });

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Failed to load data
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          padding: 32,
        }}
      >


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
              fontWeight:
                activeTab === "requests" ? 600 : 400,
            }}
          >
            🏘️ Requests
          </button>

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
              fontWeight:
                activeTab === "tasks" ? 600 : 400,
            }}
          >
            📦 Tasks
          </button>
        </div>

        {/* ✅ REQUESTS TAB */}
        {activeTab === "requests" && (
          <>
            {requests?.length === 0 && (
              <p>No available requests</p>
            )}

            {requests?.map((req: any) => (
              <div
                key={req.request_id}
                style={cardStyle}
              >
                <h3 style={{ marginBottom: 8 }}>
                  📍 {req.location}
                </h3>

                <p>
                  <strong>Budget:</strong>{" "}
                  {req.budget} NAD
                </p>

                <p>
                  <strong>Property Type:</strong>{" "}
                  {req.property_type || "Not specified"}
                </p>

                <button
                  style={buttonStyle}
                  onClick={() =>
                    navigate(
                      `/requests/${req.request_id}`
                    )
                  }
                >
                  View Details
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    marginLeft: 10,
                  }}
                  disabled={acceptMutation.isPending}
                  onClick={() =>
                    acceptMutation.mutate(
                      req.request_id
                    )
                  }
                >
                  Accept Request
                </button>
              </div>
            ))}
          </>
        )}

        {/* ✅ TASKS TAB */}
        {activeTab === "tasks" && (
          <>
            {tasks?.length === 0 && (
              <p
                style={{
                  color: "#777",
                  fontStyle: "italic",
                }}
              >
                💤 No active tasks
              </p>
            )}

            {tasks?.map((task: any) => (
              <div
                key={task.task_id}
                style={{ ...cardStyle, textAlign: "left" }}
              >
                <h3 style={{ marginBottom: 8 }}>
                  📍{" "}
                  {task.rental_requests.location}
                </h3>

                <p style={{ marginBottom: 6 }}>
                  <strong>Budget:</strong> {task.rental_requests.budget} NAD
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                    {task.status}
                </p>

                <p>
                  <strong>Escrow:</strong>{" "}
                  <StatusBadge
                    status={
                      task.escrow_payment?.status ||
                      "pending"
                    }
                  />
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  {
                    task.escrow_payment
                      ?.total_amount
                  }{" "}
                  NAD
                </p>

                {/* COMPLETE */}
                {task.status === "accepted" &&
                  task.escrow_payment?.status ===
                    "held" && (
                    <button
                      style={
                        completeMutation.isPending
                          ? disabledButtonStyle
                          : buttonStyle
                      }
                      disabled={
                        completeMutation.isPending
                      }
                      onClick={() =>
                        completeMutation.mutate(
                          task.task_id
                        )
                      }
                    >
                      {completeMutation.isPending
                        ? "Processing..."
                        : "✅ Complete Task"}
                    </button>
                )}

                {task.status === "completed" && (
                  <p style={{ color: "#6f42c1" }}>
                    ⏳ Waiting for verification
                  </p>
                )}

                {task.status === "verified" && (
                  <p style={{ color: "#28a745" }}>
                    ✅ Payment released
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
