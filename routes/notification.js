const express = require('express');
const { getNotifications, getNotificationDetail, addNotification, updateNotification, deleteNotification } = require('../controllers/notificationController');
const router = express.Router();
//Route: get all notifications
router.get('/', getNotifications);
//Route: get notification detail
router.get('/:id', getNotificationDetail);
//Route: add a new notification
router.post('/add', addNotification);
//Route: update notification
router.put('/:id', updateNotification);
//Route: delete notification
router.delete('/:id', deleteNotification);
module.exports = router;