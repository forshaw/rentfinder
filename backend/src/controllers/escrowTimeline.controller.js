const { supabase } = require('../supabase');

/**
 * User-visible escrow timeline
 */
async function getEscrowTimeline(req, res) {
  try {
    const escrowId = req.params.escrow_id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // 1️⃣ Load escrow
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('escrow_id', escrowId)
      .single();

    if (escrowError || !escrow) {
      return res.status(404).json({ error: 'Escrow not found' });
    }

    // 2️⃣ Authorization: payer, payee, or admin
    const isAllowed =
      escrow.payer_id === userId ||
      escrow.payee_id === userId ||
      userRole === 'admin';

    if (!isAllowed) {
      return res.status(403).json({
        error: 'Not authorized to view this escrow'
      });
    }

    // 3️⃣ Load audit logs
    const { data: logs, error: logsError } = await supabase
      .from('escrow_audit_logs')
      .select(
        'action, performed_by, amount, currency, note, created_at'
      )
      .eq('escrow_id', escrowId)
      .order('created_at', { ascending: true });

    if (logsError) {
      return res.status(500).json({ error: logsError.message });
    }

    // 4️⃣ Format timeline (safe for UI)
    const timeline = logs.map(log => ({
      action: log.action,
      amount: log.amount,
      currency: log.currency || 'NAD',
      note: log.note,
      performedAt: log.created_at
    }));

    res.json({
      escrow_id: escrowId,
      status: escrow.status,
      total_amount: escrow.total_amount,
      refundable_amount: escrow.refundable_amount,
      service_fee: escrow.service_fee,
      currency: 'NAD',
      timeline
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getEscrowTimeline };