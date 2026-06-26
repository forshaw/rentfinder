const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  getRevenueSummary,
  getMonthlyRevenue,
  getRevenueByEscrow
} = require('../controllers/adminFinance.controller');

const router = express.Router();

/**
 * GET /api/admin/finance/summary
 */
router.get(
  '/finance/summary',
  requireAuth,
  requireRole('admin'),
  getRevenueSummary
);

/**
 * GET /api/admin/finance/by-month
 */
router.get(
  '/finance/by-month',
  requireAuth,
  requireRole('admin'),
  getMonthlyRevenue
);

/**
 * GET /api/admin/finance/escrows
 */
router.get(
  '/finance/escrows',
  requireAuth,
  requireRole('admin'),
  getRevenueByEscrow
);

module.exports = router;
