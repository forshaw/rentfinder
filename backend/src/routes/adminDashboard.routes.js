const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const {
  getDisputedEscrows,
  getEscrowsByStatus,
  getPlatformRevenue,
  getEscrowAudit,
  getRecentEscrows
} = require('../controllers/adminDashboard.controller');

const router = express.Router();

/**
 * GET /api/admin/dashboard/disputes
 * View all disputed escrows
 */
router.get(
  '/dashboard/disputes',
  requireAuth,
  requireRole('admin'),
  getDisputedEscrows
);

/**
 * GET /api/admin/dashboard/escrows?status=held|released|cancelled|disputed
 */
router.get(
  '/dashboard/escrows',
  requireAuth,
  requireRole('admin'),
  getEscrowsByStatus
);

/**
 * GET /api/admin/dashboard/revenue
 * Platform service fee totals
 */
router.get(
  '/dashboard/revenue',
  requireAuth,
  requireRole('admin'),
  getPlatformRevenue
);

/**
 * GET /api/admin/dashboard/escrow/:escrow_id/audit
 * Full audit log for a specific escrow
 */
router.get(
  '/dashboard/escrow/:escrow_id/audit',
  requireAuth,
  requireRole('admin'),
  getEscrowAudit
);

/**
 * GET /api/admin/dashboard/recent
 * Most recent escrow activity
 */
router.get(
  '/dashboard/recent',
  requireAuth,
  requireRole('admin'),
  getRecentEscrows
);
router.get("/analytics", async (req, res) => {
  try {
    // ✅ Mock data (start here)
    res.json({
      total_revenue: 50000,
      monthly_revenue: 8000,
      completed_escrows: 120,
      active_tasks: 25,
      total_requests: 340,

      monthly_stats: [
        { month: "Jan", revenue: 4000 },
        { month: "Feb", revenue: 6000 },
        { month: "Mar", revenue: 7000 },
        { month: "Apr", revenue: 8000 },
      ],
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to load analytics" });
  }
});


module.exports = router;