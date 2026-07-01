import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { CSSProperties } from "react";
import { submitPaymentProof } from "../api/tasks.api";

export default function BankTransfer() {
  const { escrowId } = useParams();
  const navigate = useNavigate();

  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!proof) {
      alert("Please upload proof of payment");
      return;
    }

    try {
      setIsSubmitting(true);

      await submitPaymentProof(Number(escrowId), proof);

      alert("✅ Proof submitted. Awaiting admin approval.");

      navigate("/busy");
    } catch {
      alert("❌ Failed to upload proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <div style={headerSection}>
          <div style={iconCircle}>🏦</div>

          <h2 style={title}>Bank Transfer Payment</h2>

          <p style={subtitle}>
            Please make a bank transfer using the details below, then upload
            your proof of payment for admin verification.
          </p>
        </div>

        <div style={amountBox}>
          <span style={amountLabel}>Amount to Pay</span>
          <strong style={amountValue}>250 NAD</strong>
        </div>

        <div style={detailsBox}>
          <DetailRow label="Bank" value="FNB Namibia" />
          <DetailRow label="Account Name" value="RentFinder Pty Ltd" />
          <DetailRow label="Account Number" value="1234567890" />
          <DetailRow label="Branch Code" value="281872" />

          <div style={referenceRow}>
            <span style={detailLabel}>Reference</span>
            <span style={referenceValue}>ESCROW-{escrowId}</span>
          </div>
        </div>

        <div style={noticeBox}>
          <strong>Important:</strong> Use the reference{" "}
          <strong>ESCROW-{escrowId}</strong> so your payment can be matched
          correctly.
        </div>

        <div style={uploadSection}>
          <label style={uploadLabel}>Upload Proof of Payment</label>

          <label style={uploadBox}>
            <span style={uploadIcon}>📎</span>

            <span style={uploadText}>
              {proof ? proof.name : "Choose proof file"}
            </span>

            <span style={uploadHint}>
              Accepted: image or PDF payment confirmation
            </span>

            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: "none" }}
              onChange={(e) => setProof(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <button
          style={{
            ...submitButton,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "✅ Submit Payment Proof"}
        </button>

        <button style={backButton} onClick={() => navigate("/busy")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={detailRow}>
      <span style={detailLabel}>{label}</span>
      <span style={detailValue}>{value}</span>
    </div>
  );
}

/* =========================
   ✅ STYLES
========================= */

const pageWrapper: CSSProperties = {
  minHeight: "calc(100vh - 90px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "40px 16px",
  background:
    "linear-gradient(180deg, rgba(0,123,255,0.06), rgba(255,255,255,1))",
};

const card: CSSProperties = {
  width: "100%",
  maxWidth: 620,
  backgroundColor: "#ffffff",
  borderRadius: 18,
  padding: 28,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  border: "1px solid #eef0f4",
};

const headerSection: CSSProperties = {
  textAlign: "center",
  marginBottom: 24,
};

const iconCircle: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  margin: "0 auto 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#eef5ff",
  fontSize: 28,
};

const title: CSSProperties = {
  margin: 0,
  fontSize: 26,
  fontWeight: 700,
  color: "#2f3555",
};

const subtitle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "#6b7280",
};

const amountBox: CSSProperties = {
  backgroundColor: "#0d6efd",
  color: "#ffffff",
  borderRadius: 14,
  padding: "18px 20px",
  marginBottom: 22,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const amountLabel: CSSProperties = {
  fontSize: 14,
  opacity: 0.9,
};

const amountValue: CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
};

const detailsBox: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  overflow: "hidden",
  marginBottom: 18,
};

const detailRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "14px 16px",
  borderBottom: "1px solid #eef0f4",
  fontSize: 15,
};

const detailLabel: CSSProperties = {
  color: "#6b7280",
  fontWeight: 600,
};

const detailValue: CSSProperties = {
  color: "#33384d",
  fontWeight: 500,
  textAlign: "right",
};

const referenceRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "14px 16px",
  backgroundColor: "#fff8e8",
  fontSize: 15,
};

const referenceValue: CSSProperties = {
  color: "#b26a00",
  fontWeight: 800,
  textAlign: "right",
};

const noticeBox: CSSProperties = {
  backgroundColor: "#fff8e8",
  border: "1px solid #ffe1a3",
  color: "#6b4e00",
  borderRadius: 12,
  padding: 14,
  fontSize: 14,
  lineHeight: 1.5,
  marginBottom: 22,
};

const uploadSection: CSSProperties = {
  marginBottom: 20,
};

const uploadLabel: CSSProperties = {
  display: "block",
  marginBottom: 10,
  fontSize: 15,
  fontWeight: 700,
  color: "#33384d",
};

const uploadBox: CSSProperties = {
  border: "2px dashed #b8c7e0",
  borderRadius: 14,
  padding: "22px 16px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  backgroundColor: "#f8fbff",
  cursor: "pointer",
};

const uploadIcon: CSSProperties = {
  fontSize: 28,
};

const uploadText: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0d6efd",
  maxWidth: "100%",
  overflowWrap: "break-word",
};

const uploadHint: CSSProperties = {
  fontSize: 13,
  color: "#7a8194",
};

const submitButton: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  backgroundColor: "#0d6efd",
  color: "#ffffff",
  border: "none",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 700,
  boxShadow: "0 8px 18px rgba(13,110,253,0.25)",
};

const backButton: CSSProperties = {
  width: "100%",
  marginTop: 12,
  padding: "12px 18px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "none",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};