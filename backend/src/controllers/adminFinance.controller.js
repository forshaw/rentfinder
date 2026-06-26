const { supabase } = require("../supabase");

/**
 * 1️⃣ Overall platform revenue summary
 */
async function getRevenueSummary(req, res) {
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
    completedEscrows: data.length,
    totalRevenue
  });
}

/**
 * 2️⃣ Monthly revenue breakdown
 */
async function getMonthlyRevenue(req, res) {
  const { data, error } = await supabase
    .rpc('monthly_revenue_summary');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    currency: 'NAD',
    rows: data
  });
}

/**
 * 3️⃣ Revenue per escrow (detailed)
 */
async function getRevenueByEscrow(req, res) {
  const { data, error } = await supabase
    .from('escrow_payments')
    .select(
      'escrow_id, task_id, service_fee, status, created_at'
    )
    .in('status', ['released', 'cancelled'])
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    currency: 'NAD',
    rows: data
  });
}

module.exports = {
  getRevenueSummary,
  getMonthlyRevenue,
  getRevenueByEscrow
};