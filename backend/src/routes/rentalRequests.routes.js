const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  createRentalRequest,
  getMyRentalRequests,
  getOpenRentalRequests,
} = require('../controllers/rentalRequests.controller');

const router = express.Router();

// BUSY INDIVIDUAL ONLY
router.post(
  '/',
  requireAuth,
  requireRole('busy_individual'),
  createRentalRequest
);

router.get(
  '/mine',
  requireAuth,
  requireRole('busy_individual'),
  getMyRentalRequests
);

// RENT FINDER ONLY
router.get(
  '/open',
  requireAuth,
  requireRole('rent_finder'),
  getOpenRentalRequests
);

module.exports = router;
