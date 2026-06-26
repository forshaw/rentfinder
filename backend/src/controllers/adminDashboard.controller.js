const { supabase } = require('../supabase'); // Disputed escrows
async function getDisputedEscrows(req, res) {
  const { data, error } = await supabase
    .from('escrow_payments')
    .select('*')
    .eq('status', 'disputed')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/**
 * 2️⃣ Escrows by status
 */
async function getEscrowsByStatus(req, res) {
  const { status } = req.query;

  const query = supabase
    .from('escrow_payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/**
 * 3️⃣ Platform revenue (sum of service fees)
 */
async function getPlatformRevenue(req, res) {
  const { data, error } = await supabase
    .from('escrow_payments')
    .select('service_fee')
    .in('status', ['released', 'cancelled']);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const totalRevenue = data.reduce(
    (sum, row) => sum + Number(row.service_fee),
    0
  );

  res.json({
    currency: 'NAD',
    serviceFeeTotal: totalRevenue
  });
}

/**
 * 4️⃣ Escrow audit history
 */
async function getEscrowAudit(req, res) {
  const escrowId = req.params.escrow_id;

  const { data, error } = await supabase
    .from('escrow_audit_logs')
    .select('*')
    .eq('escrow_id', escrowId)
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

/**
 * 5️⃣ Recent escrows
 */
async function getRecentEscrows(req, res) {
  const { data, error } = await supabase
    .from('escrow_payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

module.exports = {
  getDisputedEscrows,
  getEscrowsByStatus,
  getPlatformRevenue,
  getEscrowAudit,
  getRecentEscrows
};

