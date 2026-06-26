const { supabase } = require('../supabase');
const { createNotification } = require('../utils/notification.helper');

/**
 * Get all pending payouts
 */
async function getPendingPayouts(req, res) {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

/**
 * Mark payout as processing
 */
async function markPayoutProcessing(req, res) {
  const { payout_id } = req.params;

  // 1️⃣ Load payout
  const { data: payout, error: payoutError } = await supabase
    .from('payouts')
    .select('*')
    .eq('payout_id', payout_id)
    .single();

  if (payoutError || !payout) {
    return res.status(404).json({ error: 'Payout not found' });
  }

  if (payout.status !== 'pending') {
    return res.status(400).json({
      error: `Cannot process payout in status: ${payout.status}`
    });
  }

  // 2️⃣ Load escrow
  const { data: escrow } = await supabase
    .from('escrow_payments')
    .select('*')
    .eq('escrow_id', payout.escrow_id)
    .single();

  if (escrow.status !== 'released') {
    return res.status(400).json({
      error: 'Escrow is not released'
    });
  }

  if (payout.amount !== escrow.refundable_amount) {
    return res.status(400).json({
      error: 'Payout amount does not match escrow'
    });
  }

  if (payout.currency !== 'NAD') {
    return res.status(400).json({
      error: 'Invalid payout currency'
    });
  }

  // 3️⃣ Move to processing
  await supabase
    .from('payouts')
    .update({ status: 'processing' })
    .eq('payout_id', payout_id);

    await recordEscrowAudit({
    escrowId: payout.escrow_id,
    action: 'payout_processing',
    performedBy: req.user.user_id,
    amount: payout.amount,
    note: 'Admin started payout'
  });


  res.json({ message: 'Payout marked as processing' });
}

/**
 * Complete payout
 */
async function completePayout(req, res) {
  const { payout_id } = req.params;

  const { data: payout } = await supabase
    .from('payouts')
    .select('*')
    .eq('payout_id', payout_id)
    .single();

  if (!payout || payout.status !== 'processing') {
    return res.status(400).json({
      error: 'Only processing payouts can be completed'
    });
  }

  await supabase
    .from('payouts')
    .update({
      status: 'completed',
      completed_at: new Date()
    })
    .eq('payout_id', payout_id);

  await createNotification({
    userId: payout.payee_id,
    type: 'payout.completed',
    message: `Your payout of ${payout.amount} NAD has been completed.`
  });

  await recordEscrowAudit({
    escrowId: payout.escrow_id,
    action: 'payout_completed',
    performedBy: req.user.user_id,
    amount: payout.amount,
    note: 'Payout completed'
  });

  res.json({ message: 'Payout completed successfully' });
}


/**
 * Fail payout
 */
async function failPayout(req, res) {
  const { payout_id } = req.params;
  const { reason } = req.body;

  await supabase
    .from('payouts')
    .update({
      status: 'failed'
    })
    .eq('payout_id', payout_id);

  res.json({
    message: 'Payout marked as failed',
    reason
  });
}

module.exports = {
  getPendingPayouts,
  markPayoutProcessing,
  completePayout,
  failPayout
};