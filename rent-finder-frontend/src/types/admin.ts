export interface DisputedEscrow {
  escrow_id: number;
  task_title: string;
  amount: number;
  created_at: string;
}

export interface AdminPayout {
  payout_id: number;
  amount: number;
  recipient: string;
  status: "pending" | "processing";
}

export interface FinanceSummary {
  total_revenue: number;
  monthly_revenue: number;
  completed_escrows: number;
}
