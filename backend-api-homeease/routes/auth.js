const express = require('express');
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyToken
} = require('../controllers/authController');

// POST /auth/login
router.post('/login', login);

// POST /auth/register (nếu có)
router.post('/register', register);

// POST /auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', resetPassword);

// GET /auth/verify (optional)
router.get('/verify', verifyToken);

module.exports = router;