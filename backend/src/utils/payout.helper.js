const { supabase } = require('../supabase');

async function createPayoutFromEscrow(escrow) {
  // Check existing payout first (idempotent)
  const { data: existing } = await supabase
    .from('payouts')
    .select('payout_id')
    .eq('escrow_id', escrow.escrow_id)
    .single();

  if (existing) return;

  // Load payout preference
  const { data: pref, error } = await supabase
    .from('payout_preferences')
    .select('*')
    .eq('user_id', escrow.payee_id)
    .single();

  if (error || !pref) {
    throw new Error('Finder has no payout preference set');
  }

  // Create payout
  await supabase.from('payouts').insert([
    {
      escrow_id: escrow.escrow_id,
      payee_id: escrow.payee_id,
      amount: escrow.refundable_amount, // ✅ 200 NAD
      currency: 'NAD',
      method: pref.method,
      destination_details: JSON.stringify(pref.details)
    }
  ]);
}


module.exports = { createPayoutFromEscrow };