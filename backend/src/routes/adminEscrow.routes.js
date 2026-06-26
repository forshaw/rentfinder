const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  adminReleaseEscrow,
  adminRefundEscrow
} = require('../controllers/adminEscrow.controller');
const { adminMoneyLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

/**
 * Admin decides to release escrow to finder
 */
router.post(
  '/escrow/:escrow_id/release',
  requireAuth,
  requireRole('admin'),
  adminMoneyLimiter,
  adminReleaseEscrow
);

/**
 * Admin decides to refund escrow to payer (200 refund, 50 retained)
 */
router.post(
  '/escrow/:escrow_id/refund',
  requireAuth,
  requireRole('admin'),
  adminMoneyLimiter,
  adminRefundEscrow
);

module.exports = router;