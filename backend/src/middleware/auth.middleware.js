const jwt = require('jsonwebtoken');

// ===============================
// JWT Authentication Middleware
// ===============================
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // ---- Check for Authorization header ----
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid authorization format' });
  }

  const token = parts[1];

  try {
    // ---- Verify token ----
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

    next(); // ✅ allow request to proceed
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };