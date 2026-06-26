const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { acceptLead, rejectLead } = require('../controllers/leadAcceptance.controller');

const router = express.Router();

// BUSY INDIVIDUAL ONLY
router.post(
  '/:id/accept',
  requireAuth,
  requireRole('busy_individual'),
  acceptLead
);

router.post(
  '/:id/reject',
  requireAuth,
  requireRole('busy_individual'),
  rejectLead
);


module.exports = router;