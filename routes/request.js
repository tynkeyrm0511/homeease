const express = require('express');
const { getRequests, getRequestDetail, addRequest, updateRequest, deleteRequest } = require('../controllers/requestController');
const router = express.Router();

//Route: get all request
router.get('/', getRequests);
//Route: get request detail
router.get('/:id', getRequestDetail)
//Route: add a new request
router.post('/add', addRequest);
//Route: update request
router.put('/:id', updateRequest);
//Route: delete request
router.delete('/:id', deleteRequest);

module.exports = router;