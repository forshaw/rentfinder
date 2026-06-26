import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  acceptRequest, fetchAvailableRequests } from "../api/finder.api";
import StatusBadge from "../components/StatusBadge";


/* =========================
   ✅ COMPONENT
========================= */

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
  queryKey: ["availableRequests"],
  queryFn: fetchAvailableRequests,
});

const request = requests?.find(
  (r: any) => r.request_id === Number(id)
);


  async function handleAccept() {
    try {
      await acceptRequest(Number(id));

      alert("✅ Request accepted!");

      queryClient.invalidateQueries({ queryKey: ["availableRequests"] });

      navigate("/finder");
    } catch {
      alert("❌ Failed to accept request");
    }
  }

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!request) {
    return <div style={{ padding: 24 }}>Request not found</div>;
  }

return (
  <div style={{ padding: 32 }}>
    
    {/* ✅ TITLE */}
    <h2 style={{
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 600,
    }}>
      🏘️ Request Details
    </h2>

    {/* ✅ CARD */}
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 10,
        padding: 24,
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        maxWidth: 500,
        textAlign: "left",
      }}
    >
      
      {/* ✅ LOCATION */}
      <h3 style={{ marginBottom: 12 }}>
        📍 {request.location}
      </h3>

      {/* ✅ DETAILS */}
      <div style={{ marginBottom: 8 }}>
        <strong>Budget:</strong> {request.budget} NAD
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Property Type:</strong>{" "}
        {request.property_type || "Not specified"}
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Status:</strong>{" "}
        <StatusBadge status={request.status || "pending"} />
      </div>

      {/* ✅ ACTION BUTTON */}   
      <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={handleAccept}
          >
            ✅ Accept Request
          </button>
        </div>
    </div>
  </div>
);
}
