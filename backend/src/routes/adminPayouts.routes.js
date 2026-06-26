const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { adminMoneyLimiter } = require('../middleware/rateLimit.middleware');
const {
  getPendingPayouts,
  markPayoutProcessing,
  completePayout,
  failPayout
} = require('../controllers/adminPayouts.controller');

const router = express.Router();

/**
 * View all pending payouts
 */
router.get(
  '/payouts/pending',
  requireAuth,
  requireRole('admin'),
  getPendingPayouts
);

/**
 * Mark payout as processing
 */
router.post(
  '/payouts/:payout_id/process',
  requireAuth,
  requireRole('admin'),
  adminMoneyLimiter,
  markPayoutProcessing
);

/**
 * Mark payout as completed
 */
router.post(
  '/payouts/:payout_id/complete',
  requireAuth,
  requireRole('admin'),
  adminMoneyLimiter,
  completePayout
);

/**
 * Mark payout as failed
 */
router.post(
  '/payouts/:payout_id/fail',
  requireAuth,
  requireRole('admin'),
  adminMoneyLimiter,
  failPayout
);

module.exports = router;
