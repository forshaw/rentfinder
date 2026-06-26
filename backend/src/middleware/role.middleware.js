// ===============================
// Role-based authorization middleware
// ===============================
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // req.user is set by requireAuth (JWT middleware)
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You are not allowed to perform this action',
      });
    }

    next(); // ✅ user has required role
  };
}

module.exports = { requireRole };