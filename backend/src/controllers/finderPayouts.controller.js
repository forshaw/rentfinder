const { supabase } = require('../supabase');

/**
 * Get payout history for logged-in finder
 */
async function getMyPayouts(req, res) {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from('payouts')
    .select(
      'payout_id, escrow_id, amount, currency, method, status, created_at, completed_at'
    )
    .eq('payee_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/**
 * Get payout summary for logged-in finder
 */
async function getMyPayoutSummary(req, res) {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from('payouts')
    .select('amount, status')
    .eq('payee_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const summary = {
    currency: 'NAD',
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalEarned: 0
  };

  for (const row of data) {
    summary[row.status] += row.amount;

    if (row.status === 'completed') {
      summary.totalEarned += row.amount;
    }
  }

  res.json(summary);
}

module.exports = {
  getMyPayouts,
  getMyPayoutSummary
};
