const express = require('express');
const router = express.Router();
const { getResidents, addResident, updateResident, deleteResident, getResidentDetail } = require('../controllers/residentController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// Get all residents route
router.get('/', authenticateToken, authorizeAdmin, getResidents);

// Other routes
router.post('/', authenticateToken, authorizeAdmin, addResident);
router.get('/:id', authenticateToken, authorizeAdmin, getResidentDetail);
router.put('/:id', authenticateToken, authorizeAdmin, updateResident);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteResident);

module.exports = router;