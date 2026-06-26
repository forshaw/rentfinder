const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { submitLead } = require('../controllers/leads.controller');

const router = express.Router();

// RENT FINDER ONLY
router.post(
  '/',
  requireAuth,
  requireRole('rent_finder'),
  submitLead
);

module.exports = router;