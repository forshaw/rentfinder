const { supabase } = require('../supabase');

async function recordEscrowAudit({
  escrowId,
  action,
  performedBy,
  amount = null,
  note = null
}) {
  const { error } = await supabase
    .from('escrow_audit_logs')
    .insert([
      {
        escrow_id: escrowId,
        action,
        performed_by: performedBy,
        amount,
        note
      }
    ]);

  if (error) {
    console.error('Escrow audit log failure:', error);
  }
}

module.exports = { recordEscrowAudit };
``