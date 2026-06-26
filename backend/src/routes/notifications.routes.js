const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { supabase } = require('../supabase');

const router = express.Router();

/**
 * GET /api/notifications
 * Get all notifications for the logged-in user
 */
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

/**
 * GET /api/notifications/unread-count
 * Get unread notification count for logged-in user
 */
router.get('/unread-count', requireAuth, async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from('notifications')
    .select('notification_id')   // ✅ NORMAL SELECT
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error("Unread count error:", error);
    console.log("USER OBJECT:", req.user);
    return res.status(500).json({ error: error.message });
  }

  // ✅ COUNT MANUALLY
  const count = data.length;

  res.json({ unreadCount: count });
});


/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch('/:id/read', requireAuth, async (req, res) => {
  const userId = req.user.userId;
  const notificationId = req.params.id;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('notification_id', notificationId)
    .eq('user_id', userId); // ownership protection

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Notification marked as read' });
});

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read for logged-in user
 */
router.patch('/mark-all-read', requireAuth, async (req, res) => {
  const userId = req.user.userId;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
