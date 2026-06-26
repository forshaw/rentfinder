const { sendNotification } = require("../services/push.service");

const { supabase } = require("../supabase");

async function subscribe(req, res) {
  const { userId, subscription } = req.body;

  if (!userId || !subscription) {
    return res.status(400).json({
      error: "userId and subscription are required",
    });
  }

  const { endpoint, keys } = subscription;

  const { error } = await supabase
    .from("push_subscriptions")
    .insert([
      {
        user_id: userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    ]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save subscription" });
  }

  console.log("✅ Subscription saved for user:", userId);

  return res.status(201).json({ success: true });
}


/**
 * Send a test notification (admin/dev use)
 */

async function sendTestNotification(req, res) {
  const { userId, title, body } = req.body;

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: "DB error" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: "No subscription found for user",
    });
  }

 for (const sub of subs) {
  const subscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth,
    },
  };

  try {
    await sendNotification(subscription, {
      title,
      body,
    });

  } catch (err) {
    console.error("Push error:", err.statusCode);

    // ✅ THIS IS THE IMPORTANT PART
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Subscription is invalid → remove it
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", sub.endpoint);

      console.log("❌ Removed expired subscription");
    }
  }
}

}

module.exports = {
  subscribe,
  sendTestNotification,
};