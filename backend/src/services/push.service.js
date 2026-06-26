const webPush = require("../config/push.config");

/**
 * Sends a push notification to a single subscription
 */
async function sendNotification(subscription, payload) {
  return webPush.sendNotification(
    subscription,
    JSON.stringify(payload)
  );
}

module.exports = {
  sendNotification,
};