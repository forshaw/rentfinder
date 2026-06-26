import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRequest } from "../api/requests.api";
import { useNavigate } from "react-router-dom";

/* =========================
   ✅ STYLES
========================= */

const containerStyle = {
  display: "flex",
  justifyContent: "center",
};

const cardStyle = {
  maxWidth: 600,
  width: "100%",
  marginTop: 40,
  padding: 24,
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const labelStyle = {
  fontWeight: 500,
  marginBottom: 4,
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  marginBottom: 12,
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

/* =========================
   ✅ COMPONENT
========================= */

export default function CreateRequest() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createRequest(
        {
          location,
          budget: Number(budget),
          property_type: propertyType,
        },
        token!
      );

      alert("✅ Request submitted successfully");

      navigate("/dashboard");

    } catch {
      alert("❌ Failed to submit request");
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <h2 style={{ marginBottom: 20 }}>
          🏘️ Create Rental Request
        </h2>

        <form onSubmit={handleSubmit}>
          
          {/* LOCATION */}
          <label style={labelStyle}>Location</label>
          <input
            style={inputStyle}
            placeholder="Enter preferred location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {/* BUDGET */}
          <label style={labelStyle}>Budget (NAD)</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="e.g. 5000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          {/* PROPERTY TYPE */}
          <label style={labelStyle}>Property Type</label>
          <select
            style={inputStyle}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select property type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="room">Room</option>
          </select>

          <button style={buttonStyle}>
            ✅ Submit Request
          </button>
        </form>
        <p style={{ color: "#666", fontSize: 14, marginTop: 10 }}>
          💡 A finder will accept your request before you make payment.
        </p>
      </div>
    </div>
  );
}