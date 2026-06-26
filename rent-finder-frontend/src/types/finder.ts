import type { EscrowStatus } from "./tasks";

export interface FinderTask {
  task_id: number;
  title: string;
  escrow_status: EscrowStatus;
  created_at: string;
}

export interface Payout {
  payout_id: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}