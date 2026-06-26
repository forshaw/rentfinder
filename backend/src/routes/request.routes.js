const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { supabase } = require("../supabase");
const { createNotification } = require("../utils/notification.helper");

const router = express.Router();

/**
 * ✅ CREATE REQUEST
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { location, budget, property_type } = req.body;

    if (!location || !budget) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("rental_requests")
      .insert([
        {
          user_id: userId,
          location,
          budget,
          property_type,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ GET ALL OPEN REQUESTS (for finders)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rental_requests")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ ACCEPT REQUEST → CREATE TASK
 */
router.post("/:id/accept", requireAuth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const finderId = req.user.userId;

    // ✅ GET request
    const { data: request } = await supabase
      .from("rental_requests")
      .select("*")
      .eq("request_id", requestId)
      .single();

    if (!request || request.status !== "open") {
      return res.status(400).json({ error: "Invalid request" });
    }

    // ✅ UPDATE request
    await supabase
      .from("rental_requests")
      .update({ status: "accepted" })
      .eq("request_id", requestId);

    // ✅ CREATE task
    const { data: task } = await supabase
      .from("tasks")
      .insert([
        {
          request_id: requestId,
          finder_id: finderId,
          status: "accepted",
        },
      ])
      .select()
      .single();

    // ✅ CREATE ESCROW (YOUR TABLE)
    await supabase
      .from("escrow_payments")
      .insert([
        {        
          task_id: task.task_id,
          payer_id: request.user_id,
          payee_id: finderId,

          // ✅ HARDCODED VALUES
          total_amount: 250,
          refundable_amount: 200,
          service_fee: 50,

          currency: "NAD",
          status: "pending",

        },
      ]);

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
/**
 * ✅ GET MY REQUESTS (BUSY USER)
 */
router.get("/my-requests", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ JOIN tasks + finder info
    const { data, error } = await supabase
      .from("rental_requests")
      .select(`
        *,
        tasks (
          task_id,
          finder_id,
          users (
            name,
            phone_number
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;