const express = require('express');
const router = express.Router();
const { getNotifications, addNotification, updateNotification, deleteNotification, getNotificationDetail } = require('../controllers/notificationController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// Admin: get all notifications
router.get('/', authenticateToken, authorizeAdmin, getNotifications);

// Admin: add a new notification
router.post('/add', authenticateToken, authorizeAdmin, addNotification);

// Admin: update notification
router.put('/:id', authenticateToken, authorizeAdmin, updateNotification);

// Admin: delete notification
router.delete('/:id', authenticateToken, authorizeAdmin, deleteNotification);

// Admin: get notification detail
router.get('/:id', authenticateToken, authorizeAdmin, getNotificationDetail);

module.exports = router;