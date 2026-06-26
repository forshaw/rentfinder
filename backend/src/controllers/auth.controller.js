const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../supabase"); // adjust path if needed

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // ✅ 1. Get user from DB
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      return res.status(500).json({ message: "Database error" });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    console.log("🔐 Input password:", password);
    console.log("🔐 Stored hash:", user.password_hash);

    // ✅ 2. Compare password correctly
    const isMatch = await bcrypt.compare(password, user.password_hash);

    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 3. Generate JWT
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ 4. Return response
    return res.json({
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function register(req, res) {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name, // ✅ REQUIRED FIELD
          email,
          password_hash: hash,
          role,
          phone_number: phone, // ✅ CORRECT (you insisted ✅)
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: error.message });
    }

    const token = jwt.sign(
      {
        userId: data.user_id,
        email: data.email,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: data,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { login, register };