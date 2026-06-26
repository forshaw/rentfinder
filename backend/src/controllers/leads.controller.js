const { supabase } = require('../supabase');

// ===============================
// POST /api/leads
// Rent finder submits a lead
// ===============================
async function submitLead(req, res) {
  try {
    const {
      rental_request_id,
      property_address,
      agent_name,
      agent_contact,
      viewing_info
    } = req.body;

    if (!rental_request_id || !property_address || !agent_name) {
      return res.status(400).json({
        error: 'rental_request_id, property_address, and agent_name are required'
      });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          task_id: rental_request_id,
          property_address,
          agent_name,
          agent_contact: agent_contact || null,
          viewing_info: viewing_info || null,
          verified: false
        }
      ])
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { submitLead };
