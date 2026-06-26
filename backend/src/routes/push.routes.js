const express = require("express");
const router = express.Router();

const {
  subscribe,
  sendTestNotification,
} = require("../controllers/push.controller");

/**
 * Save a push subscription
 */
router.post("/subscribe", subscribe);

/**
 * Dev/Admin test endpoint
 */
router.post("/test", sendTestNotification);

module.exports = router;
