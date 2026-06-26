const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { upsertPayoutPreference } = require('../controllers/payoutPreferences.controller');

const router = express.Router();

/**
 * POST /api/payout-preferences
 * Finder sets or updates payout preference
 */
router.post('/', requireAuth, upsertPayoutPreference);

module.exports = router;
