const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { supabase } = require("../supabase");

const {
  payEscrow,
  cancelEscrow,
  disputeEscrow
} = require('../controllers/escrow.controller');
const { getEscrowTimeline } = require('../controllers/escrowTimeline.controller');
const { sensitiveLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

/**
 * POST /api/escrow/:escrow_id/pay
 * Busy individual pays into escrow
 */
router.post('/:escrow_id/pay', requireAuth,sensitiveLimiter, payEscrow);

 
/**
 * POST /api/escrow/:escrow_id/cancel
 * Busy individual cancels escrow with partial refund
 */

router.post('/:escrow_id/cancel', requireAuth,sensitiveLimiter, cancelEscrow);

/**
 * POST /api/escrow/:escrow_id/dispute
 * Raise a dispute on escrow
 */
router.post('/:escrow_id/dispute', requireAuth,sensitiveLimiter, disputeEscrow);

router.post("/:id/fund", requireAuth, async (req, res) => {
  try {
    const escrowId = Number(req.params.id);

    console.log("👉 Funding escrow:", escrowId);

    // ✅ STEP 1: UPDATE ONLY (NO SELECT)
    const { error } = await supabase
      .from("escrow_payments")
      .update({ status: "held" })
      .eq("escrow_id", escrowId);

    if (error) {
      console.error("❌ Supabase update error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Escrow status updated");

    // ✅ STEP 2: RETURN SIMPLE RESPONSE (NO SELECT)
    res.json({ message: "Escrow funded" });

  } catch (err) {
    console.error("❌ Server crash:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/release", requireAuth, async (req, res) => {
  await supabase
    .from("escrow_payments")
    .update({ status: "released" })
    .eq("escrow_id", req.params.id);

  res.json({ message: "✅ Payment released" });
});

router.get(
  '/:escrow_id/timeline',
  requireAuth,
  getEscrowTimeline
);

module.exports = router;