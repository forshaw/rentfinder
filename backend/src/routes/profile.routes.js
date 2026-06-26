const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/profile
router.get('/', requireAuth, (req, res) => {
  res.json({
    message: 'Authenticated request successful',
    user: req.user,
  });
});

module.exports = router;