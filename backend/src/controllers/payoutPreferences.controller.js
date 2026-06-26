const { supabase } = require('../supabase');

async function upsertPayoutPreference(req, res) {
  const userId = req.user.userId;
  const { method, details } = req.body;

  if (!method || !details) {
    return res.status(400).json({ error: 'Method and details are required' });
  }

  const { error } = await supabase
    .from('payout_preferences')
    .upsert({
      user_id: userId,
      method,
      details,
      updated_at: new Date()
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Payout preference saved successfully' });
}

module.exports = { upsertPayoutPreference };