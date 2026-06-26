import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitPaymentProof } from "../api/tasks.api"

export default function BankTransfer() {
  const { escrowId } = useParams();
  const navigate = useNavigate();

  const [proof, setProof] = useState<File | null>(null);

 const handleSubmit = async () => {
  if (!proof) {
    alert("Please upload proof of payment");
    return;
  }

  try {
    await submitPaymentProof(Number(escrowId), proof);

    alert("✅ Proof submitted. Awaiting admin approval.");

    navigate("/busy");
  } catch {
    alert("❌ Failed to upload proof");
  }
};

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h2>🏦 Bank Transfer Payment</h2>

      <div style={{ marginTop: 20 }}>
        <p><strong>Bank:</strong> FNB Namibia</p>
        <p><strong>Account Name:</strong> RentFinder Pty Ltd</p>
        <p><strong>Account Number:</strong> 1234567890</p>
        <p><strong>Branch Code:</strong> 281872</p>
        <p><strong>Reference:</strong> ESCROW-{escrowId}</p>
        <p><strong>Amount:</strong> 250 NAD</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="file"
          onChange={(e) =>
            setProof(e.target.files?.[0] || null)
          }
        />
      </div>

      <button
        style={{
          marginTop: 20,
          padding: "10px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={handleSubmit}
      >
        Submit Payment Proof
      </button>
    </div>
  );
}