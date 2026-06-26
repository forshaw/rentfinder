const { supabase } = require('../supabase');
const { createNotification } = require('../utils/notification.helper');

/**
 * Pay into escrow (mock payment)
 * Moves escrow: pending → held
 */
async function payEscrow(req, res) {
  try {
    const escrowId = req.params.escrow_id;
    const userId = req.user.userId;

    // 1️⃣ Load escrow
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('escrow_id', escrowId)
      .single();

    if (escrowError || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // 2️⃣ Ownership check (only payer can pay)
    if (escrow.payer_id !== userId) {
      return res.status(403).json({
        error: 'You are not allowed to pay this escrow'
      });
    }

    // 3️⃣ State check
    if (escrow.status !== 'pending') {
      return res.status(400).json({
        error: `Escrow cannot be paid in status: ${escrow.status}`
      });
    }

    /**
     * 4️⃣ MOCK PAYMENT
     * (Real provider integration goes here later)
     */
    const mockPaymentReference = `MOCK_${Date.now()}`;

    // 5️⃣ Update escrow to held
    const { error: updateError } = await supabase
      .from('escrow_payments')
      .update({
        status: 'held',
        provider: 'mock',
        provider_ref: mockPaymentReference,
        updated_at: new Date()
      })
      .eq('escrow_id', escrowId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // 6️⃣ Notify payer
    await createNotification({
      userId: escrow.payer_id,
      type: 'escrow.paid',
      message: `Your payment of ${escrow.total_amount} has been received and is now held in escrow.`
    });

    // 7️⃣ Notify finder
    await createNotification({
      userId: escrow.payee_id,
      type: 'escrow.held',
      message: 'Payment has been secured in escrow. You may continue working.'
    });
    await recordEscrowAudit({
      escrowId,
      action: 'paid_into_escrow',
      performedBy: userId,
      amount: escrow.total_amount,
      note: 'Client paid into escrow'
    });

    res.json({
      message: 'Payment successful. Funds are now held in escrow.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
/**
 * Cancel escrow with partial refund (200 refunded, 50 retained)
 */
async function cancelEscrow(req, res) {
  try {
    const escrowId = req.params.escrow_id;
    const userId = req.user.userId;

    // 1️⃣ Load escrow
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('escrow_id', escrowId)
      .single();

    if (escrowError || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // 2️⃣ Only payer can cancel
    if (escrow.payer_id !== userId) {
      return res.status(403).json({
        error: 'You are not authorized to cancel this escrow'
      });
    }

    // 3️⃣ Validate escrow state
    if (escrow.status !== 'held') {
      return res.status(400).json({
        error: `Escrow cannot be cancelled in status: ${escrow.status}`
      });
    }

    /**
     * 4️⃣ PARTIAL REFUND (PROVIDER‑AGNOSTIC)
     * No Stripe / Paystack logic
     * Refund only refundable_amount
     */
    const refundAmount = escrow.refundable_amount; // 200
    const retainedFee = escrow.service_fee;         // 50

    console.log(
      `Refunding ${refundAmount}, retaining service fee ${retainedFee}`
    );

    // TODO: integrate bank/mobile refund later
    // CURRENT: logical refund only (MVP-safe)

    // 5️⃣ Update escrow status
    const { error: updateError } = await supabase
      .from('escrow_payments')
      .update({
        status: 'cancelled',
        updated_at: new Date()
      })
      .eq('escrow_id', escrowId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // 6️⃣ Notify payer
    await createNotification({
      userId: escrow.payer_id,
      type: 'escrow.cancelled',
      message: `Your escrow was cancelled. ${refundAmount} refunded, ${retainedFee} retained as service fee.`
    });

    // 7️⃣ Notify finder
    await createNotification({
      userId: escrow.payee_id,
      type: 'escrow.cancelled',
      message: 'The task was cancelled by the client. No payment was released.'
    });
    await recordEscrowAudit({
      escrowId,
      action: 'escrow_cancelled',
      performedBy: userId,
      amount: escrow.refundable_amount,
      note: 'Client cancelled escrow, partial refund applied'
    });

    res.json({
      message: 'Escrow cancelled successfully',
      refunded: refundAmount,
      retained: retainedFee
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
/**
 * Raise a dispute on escrow
 * Freezes funds pending admin resolution
 */
async function disputeEscrow(req, res) {
  try {
    const escrowId = req.params.escrow_id;
    const userId = req.user.userId;

    // 1️⃣ Load escrow
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('escrow_id', escrowId)
      .single();

    if (escrowError || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // 2️⃣ Validate state
    if (escrow.status !== 'held') {
      return res.status(400).json({
        error: `Escrow cannot be disputed in status: ${escrow.status}`
      });
    }

    // 3️⃣ Only payer or payee may dispute
    if (escrow.payer_id !== userId && escrow.payee_id !== userId) {
      return res.status(403).json({
        error: 'You are not authorized to dispute this escrow'
      });
    }

    // 4️⃣ Update escrow → disputed
    const { error: updateError } = await supabase
      .from('escrow_payments')
      .update({
        status: 'disputed',
        updated_at: new Date()
      })
      .eq('escrow_id', escrowId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // 5️⃣ Notifications
    await createNotification({
      userId: escrow.payer_id,
      type: 'escrow.disputed',
      message: 'The escrow has been disputed. Funds are temporarily frozen.'
    });
    await recordEscrowAudit({
      escrowId,
      action: 'escrow_disputed',
      performedBy: userId,
      note: 'Dispute raised, funds frozen'
    });

    await createNotification({
      userId: escrow.payee_id,
      type: 'escrow.disputed',
      message: 'A dispute has been raised. Funds are temporarily frozen.'
    });

    res.json({
      message: 'Escrow disputed successfully. Funds are frozen pending review.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


module.exports = { payEscrow, cancelEscrow, disputeEscrow };