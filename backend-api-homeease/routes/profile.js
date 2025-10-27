const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    updatePassword,
    getProfileStats
} = require('../controllers/profileController');

// Protect all profile routes
router.use(authenticateToken);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfile);

// Update password
router.put('/password', updatePassword);

// Get user statistics
router.get('/stats', getProfileStats);

module.exports = router;