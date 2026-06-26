export type EscrowStatus =
  | "pending"
  | "held"
  | "released"
  | "cancelled"
  | "disputed";

export interface Task {
  task_id: number;
  title: string;
  status: "submitted" | "accepted" | "verified";
  escrow_id: number;
  escrow_status: EscrowStatus;
  created_at: string;
}
