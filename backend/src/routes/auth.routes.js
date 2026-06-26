const express = require('express');
const { login } = require('../controllers/auth.controller');
const { register } = require("../controllers/auth.controller");

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

module.exports = router;
    