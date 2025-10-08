const express = require('express');
const router = express.Router();
const { getRequests, addRequest, updateRequest, deleteRequest, getRequestDetail } = require('../controllers/requestController');
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

// Admin: get all requests
router.get('/', authenticateToken, authorizeAdmin, getRequests);

// Admin: add a new request
router.post('/add', authenticateToken, authorizeAdmin, addRequest);

// Admin: update request
router.put('/:id', authenticateToken, authorizeAdmin, updateRequest);

// Admin: delete request
router.delete('/:id', authenticateToken, authorizeAdmin, deleteRequest);

// Admin or resident: get request detail
router.get('/:id', authenticateToken, authorizeSelfOrAdmin, getRequestDetail);

module.exports = router;