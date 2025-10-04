const express = require('express');
const router = express.Router();
const { getResidents, addResident, updateResident, deleteResident, getResidentDetail } = require('../controllers/residentController')

//Route: get all residents
router.get('/', getResidents);
//Route: get detail resident
router.get('/:id', getResidentDetail);

//Route: add a new resident
router.post('/add', addResident);

//Route: update resident
router.put('/:id', updateResident);

//Route: delete resident
router.delete('/:id', deleteResident);
module.exports = router;