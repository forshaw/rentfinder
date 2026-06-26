const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  getMyPayouts,
  getMyPayoutSummary
} = require('../controllers/finderPayouts.controller');

const router = express.Router();

/**
 * GET /api/my/payouts
 * Finder payout history
 */
router.get('/payouts', requireAuth, getMyPayouts);

/**
 * GET /api/my/payouts/summary
 * Finder payout totals
 */
router.get('/payouts/summary', requireAuth, getMyPayoutSummary);

module.exports = router;
