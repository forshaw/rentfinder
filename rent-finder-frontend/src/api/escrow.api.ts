import { apiFetch } from "./apiClient";
import type { EscrowTimelineEvent } from "../types/escrow";

export function fetchEscrowTimeline(
  escrowId: number
): Promise<EscrowTimelineEvent[]> {
  return apiFetch(`/api/escrow/${escrowId}/timeline`);
}