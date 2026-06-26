const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { supabase } = require("../supabase");

const router = express.Router();

/**
 * ✅ FINDER TASKS
 */
router.get("/finder", requireAuth, async (req, res) => {
  try {
    const finderId = req.user.userId;

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        *,
        rental_requests (
          location,
          budget,
          property_type
        )
      `)
      .eq("finder_id", finderId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ✅ attach escrow
    const result = await Promise.all(
      tasks.map(async (task) => {
        const { data: escrow } = await supabase
          .from("escrow_payments")
          .select("*")
          .eq("task_id", task.task_id)
          .single();

        return {
          ...task,
          escrow_payment: escrow || null,
        };
      })
    );

    res.json(result);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ BUSY USER TASKS (FIXED)
 */
router.get("/busy", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ Get user's requests
    const { data: requests } = await supabase
      .from("rental_requests")
      .select("request_id")
      .eq("user_id", userId);

    const requestIds = requests.map((r) => r.request_id);

    if (requestIds.length === 0) {
      return res.json([]);
    }

    // ✅ Get tasks linked to those requests
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .in("request_id", requestIds);

    // ✅ Attach escrow
    const result = await Promise.all(
      tasks.map(async (task) => {
        const { data: escrow } = await supabase
          .from("escrow_payments")
          .select("*")
          .eq("task_id", task.task_id)
          .single();

        return {
          ...task,
          escrow_payment: escrow || null,
        };
      })
    );

    res.json(result);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ FINDER: COMPLETE TASK
 */
router.post("/:id/complete", requireAuth, async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    // ✅ Update task
    await supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("task_id", taskId);

    console.log("✅ Task completed:", taskId);

    res.json({ message: "Task completed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/verify", requireAuth, async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    console.log("👉 Verifying task:", taskId);

    // ✅ 1. Get escrow
    const { data: escrow } = await supabase
      .from("escrow_payments")
      .select("*")
      .eq("task_id", taskId)
      .single();

    if (!escrow) {
      return res.status(404).json({ error: "Escrow not found" });
    }

    // ✅ 2. Release payment
    await supabase
      .from("escrow_payments")
      .update({
        status: "released",
      })
      .eq("escrow_id", escrow.escrow_id);

    // ✅ 3. Update task status
    await supabase
      .from("tasks")
      .update({ status: "verified" })
      .eq("task_id", taskId);

    console.log("✅ Payment released");

    res.json({ message: "Task verified & payment released" });

  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
