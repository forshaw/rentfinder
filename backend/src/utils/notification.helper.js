const { supabase } = require("../supabase");
const { sendNotification } = require("../services/push.service");

async function createNotification({ userId, type, message, link }) {

  // ✅ 1. Save notification in DB
  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        type,
        message,
        link,
      },
    ]);

  if (error) {
    console.error("Notification insert error:", error);
  }

  // ✅ 2. Fetch push subscriptions for user
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  // ✅ 3. Send push to all devices
  if (subs && subs.length > 0) {
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
          title: "Notification 🔔",
          body: message,
        });
      } catch (err) {
        console.error("Push send error:", err);
      }
    }
  }

  return { success: true };
}

module.exports = {
  createNotification,
};
