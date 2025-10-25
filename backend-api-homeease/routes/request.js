const express = require('express');
const router = express.Router();
const { getRequests, addRequest, updateRequest, deleteRequest, getRequestDetail, cancelRequest } = require('../controllers/requestController');
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/authMiddleware');

// Authenticated users: get requests (admin will get all, resident can pass userId query)
router.get('/', authenticateToken, getRequests);

// Allow authenticated users (residents) to create requests via POST /request
// Frontend calls POST /request so we add this route. Keep /add for backward compat.
router.post('/', authenticateToken, addRequest);

// Backwards compatible route - allow authenticated users as well (previously admin-only)
router.post('/add', authenticateToken, addRequest);

// Admin: update request
router.put('/:id', authenticateToken, authorizeAdmin, updateRequest);

// Admin: delete request
router.delete('/:id', authenticateToken, authorizeAdmin, deleteRequest);

// Allow owner or admin to cancel a request
router.post('/:id/cancel', authenticateToken, authorizeSelfOrAdmin, cancelRequest);

// Admin or resident: get request detail
router.get('/:id', authenticateToken, authorizeSelfOrAdmin, getRequestDetail);

module.exports = router;