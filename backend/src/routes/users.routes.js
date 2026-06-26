// ✅ IMPORT EXPRESS (THIS LINE WAS MISSING)
const express = require('express');

//Protection to routes
const { getUsers, createUser } = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Create a new router instance
const router = express.Router();

// PUBLIC
router.post('/', createUser);

// PROTECTED
router.get('/', requireAuth, getUsers);

// GET /api/users
router.get('/', getUsers);

// POST /api/users
router.post('/', createUser);

// Export the router so app.js can use it
module.exports = router;