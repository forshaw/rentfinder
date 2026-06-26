
const { supabase } = require('../supabase');
const { createNotification } = require('../utils/notification.helper');
const { createPayoutFromEscrow } = require('../utils/payout.helper');
/**
 * Admin releases escrow funds to finder
 * Finder receives refundable_amount (200 NAD)
 * Platform retains service_fee (50 NAD)
 */
async function adminReleaseEscrow(req, res) {
  const escrowId = req.params.escrow_id;

  const { data: escrow, error } = await supabase
    .from('escrow_payments')
    .select('*')
    .eq('escrow_id', escrowId)
    .single();

  if (error || !escrow) {
    return res.status(404).json({ error: 'Escrow not found' });
  }

  if (escrow.status !== 'disputed') {
    return res.status(400).json({
      error: 'Escrow must be in disputed state'
    });
  }

  const payoutToFinder = escrow.refundable_amount; // ✅ 200
  const platformFee = escrow.service_fee;           // ✅ 50

  console.log(
    `Admin releasing ${payoutToFinder} NAD to finder ${escrow.payee_id}. ` +
    `Platform retains ${platformFee} NAD.`
  );

  await supabase
    .from('escrow_payments')
    .update({
      status: 'released',
      updated_at: new Date()
    })
    .eq('escrow_id', escrowId);

  await createNotification({
    userId: escrow.payee_id,
    type: 'escrow.released',
    message: `Admin resolved dispute. ${payoutToFinder} NAD has been released to you.`
  });

  await createNotification({
    userId: escrow.payer_id,
    type: 'escrow.resolved',
    message: `Admin resolved dispute. ${payoutToFinder} NAD was paid to the finder. 50 NAD service fee retained.`
  });
  await recordEscrowAudit({
      escrowId,
      action: 'admin_released',
      performedBy: req.user.user_id,
      amount: escrow.refundable_amount,
      note: 'Admin released escrow to finder'
    });
await createPayoutFromEscrow(escrow);

  res.json({
    message: 'Escrow released to finder by admin',
    finderPaid: payoutToFinder,
    platformRetained: platformFee
  });
}

/**
 * Admin refunds escrow to payer (partial refund)
 */
async function adminRefundEscrow(req, res) {
  const escrowId = req.params.escrow_id;

  // 1️⃣ Load escrow
  const { data: escrow, error } = await supabase
    .from('escrow_payments')
    .select('*')
    .eq('escrow_id', escrowId)
    .single();

  if (error || !escrow) {
    return res.status(404).json({ error: 'Escrow not found' });
  }

  if (escrow.status !== 'disputed') {
    return res.status(400).json({
      error: 'Escrow is not in disputed state'
    });
  }

  // 2️⃣ Refund payer (200), retain service fee (50)
  await supabase
    .from('escrow_payments')
    .update({
      status: 'cancelled',
      updated_at: new Date()
    })
    .eq('escrow_id', escrowId);

  // 3️⃣ Notifications
  await createNotification({
    userId: escrow.payer_id,
    type: 'escrow.refunded',
    message: `Admin resolved dispute. ${escrow.refundable_amount} NAD refunded. Service fee retained.`
  });

  await createNotification({
    userId: escrow.payee_id,
    type: 'escrow.resolved',
    message: 'Admin resolved dispute and refunded the client.'
  });
  await recordEscrowAudit({
      escrowId,
      action: 'admin_refunded',
      performedBy: req.user.user_id,
      amount: escrow.refundable_amount,
      note: 'Admin refunded payer, service fee retained'
    });

  res.json({
    message: 'Escrow refunded to payer by admin',
    refunded: escrow.refundable_amount,
    retained: escrow.service_fee
  });
}

module.exports = {
  adminReleaseEscrow,
  adminRefundEscrow
};
