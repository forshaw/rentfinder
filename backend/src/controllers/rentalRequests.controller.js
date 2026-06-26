const { supabase } = require('../supabase');

// ===============================
// POST /api/rental-requests
// Busy individual creates a request
// ===============================
async function createRentalRequest(req, res) {
  try {
    const { location, budget, property_type } = req.body;

    if (!location || !budget || !property_type) {
      return res.status(400).json({
        error: 'location, budget, and property_type are required',
      });
    }

    const { data, error } = await supabase
      .from('rental_requests')
      .insert([
        {
          user_id: req.user.user_id, // 🔑 linked to auth user
          location,
          budget,
          property_type,
          status: 'open',
        },
      ])
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

// ===============================
// GET /api/rental-requests/mine
// Busy individual views own requests
// ===============================
async function getMyRentalRequests(req, res) {
  const { data, error } = await supabase
    .from('rental_requests')
    .select('*')
    .eq('user_id', req.user.user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

// ===============================
// GET /api/rental-requests/open
// Rent finder views open requests
// ===============================
async function getOpenRentalRequests(req, res) {
  const { data, error } = await supabase
    .from('rental_requests')
    .select('*')
    .eq('status', 'open');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
}

module.exports = {
  createRentalRequest,
  getMyRentalRequests,
  getOpenRentalRequests,
};
