const express = require('express');
const router = express.Router();
const { getResidents, addResident, updateResident, deleteResident, getResidentDetail } = require('../controllers/residentController');
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

// Admin: get all residents
router.get('/', authenticateToken, authorizeAdmin, getResidents);

// Admin: add a new resident
router.post('/add', authenticateToken, authorizeAdmin, addResident);

// Admin: update resident
router.put('/:id', authenticateToken, authorizeAdmin, updateResident);

// Admin: delete resident
router.delete('/:id', authenticateToken, authorizeAdmin, deleteResident);

// Admin or resident: get resident detail
router.get('/:id', authenticateToken, authorizeSelfOrAdmin, getResidentDetail);

module.exports = router;