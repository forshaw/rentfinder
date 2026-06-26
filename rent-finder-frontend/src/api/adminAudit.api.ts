import { apiFetch } from "./apiClient";
import type { EscrowAuditLog } from "../types/audit";

export function fetchEscrowAuditLog(
  escrowId: number
): Promise<EscrowAuditLog[]> {
  return apiFetch(`/api/admin/escrows/${escrowId}/audit-log`);
}
