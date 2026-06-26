export interface EscrowTimelineEvent {
  event: string;
  description: string;
  amount: number | null;
  created_at: string;
}
