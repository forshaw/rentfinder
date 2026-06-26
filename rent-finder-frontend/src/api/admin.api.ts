import { apiFetch } from "./apiClient";
import type {
  DisputedEscrow,
  AdminPayout,
  FinanceSummary,
} from "../types/admin";

/**
 * ✅ Disputes
 */
export function fetchDisputedEscrows(): Promise<DisputedEscrow[]> {
  return apiFetch("/api/admin/disputes");
}

export function resolveEscrow(
  escrowId: number,
  action: "release" | "refund"
): Promise<void> {
  return apiFetch(`/api/admin/escrow/${escrowId}/resolve`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

/**
 * ✅ Payouts
 */
export function fetchPendingPayouts(): Promise<AdminPayout[]> {
  return apiFetch("/api/admin/payouts/pending");
}

export function processPayout(
  payoutId: number,
  status: "completed" | "failed"
): Promise<void> {
  return apiFetch(`/api/admin/payouts/${payoutId}/process`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
}

/**
 * ✅ Finance
 */
export function fetchFinanceSummary(): Promise<FinanceSummary> {
  return apiFetch("/api/admin/finance/summary");
}

/**
 * ✅ Payment Proofs (FIXED → uses apiFetch)
 */
export function fetchPaymentProofs(): Promise<any[]> {
  return apiFetch("/api/admin/proofs");
}

/**
 * ✅ Verify Payment (Approve / Reject)
 */
export function verifyPayment(
  escrowId: number,
  action: "approve" | "reject"
): Promise<void> {
  return apiFetch("/api/admin/verify-payment", {
    method: "POST",
    body: JSON.stringify({
      escrowId,
      action,
    }),
  });
}
/**
 * ✅ Analytics
 */
export function fetchAnalytics(): Promise<any> {
  return apiFetch("/api/admin/analytics");
}