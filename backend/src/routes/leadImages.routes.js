const express = require('express');
const multer = require('multer');

const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { uploadLeadImage } = require('../controllers/leadImages.controller');

const router = express.Router();

// Multer in‑memory storage
const upload = multer({ storage: multer.memoryStorage() });

/**
 * RENT FINDER ONLY
 * POST /api/leads/:id/images
 */
router.post(
  '/:id/images',
  requireAuth,
  requireRole('rent_finder'),
  upload.single('image'),
  uploadLeadImage
);

module.exports = router;