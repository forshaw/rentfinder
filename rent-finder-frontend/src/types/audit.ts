export interface EscrowAuditLog {
  id: number;
  action:
    | "ESCROW_CREATED"
    | "ESCROW_PAID"
    | "ESCROW_CANCELLED"
    | "ESCROW_RELEASED"
    | "ESCROW_REFUNDED"
    | "DISPUTE_OPENED"
    | "DISPUTE_RESOLVED";
  actor: "system" | "busy_individual" | "rent_finder" | "admin";
  amount: number | null;
  created_at: string;
}