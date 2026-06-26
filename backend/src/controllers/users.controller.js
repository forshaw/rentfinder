// Supabase client (REST over HTTPS)
const { supabase } = require('../supabase');

// Library for hashing passwords securely
const bcrypt = require('bcrypt');

// ===============================
// GET /api/users
// ===============================
async function getUsers(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, name, email, role, phone_number');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ===============================
// POST /api/users
// ===============================
async function createUser(req, res) {
  try {
    const { name, email, password, role, phone_number } = req.body;

    // ---- Basic validation ----
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'name, email, password, and role are required',
      });
    }

    // ---- Role validation ----
    const allowedRoles = ['busy_individual', 'rent_finder'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // ---- Password rules ----
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
      });
    }

    // ---- Email uniqueness check ----
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // ---- Hash the password ----
    const password_hash = await bcrypt.hash(password, 10);

    // ---- Insert user ----
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash,
          role,
          phone_number: phone_number || null,
        },
      ])
      .select('user_id, name, email, role, phone_number')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ---- Return safe response ----
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
}

module.exports = {
  getUsers,
  createUser,
};