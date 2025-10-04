const express = require('express');
const router = express.Router();

//Route: lay danh sach cu dan
router.get('/', (req, res) => {
    res.send('Danh sach dan cu');
});

//Route: them dan cu moi
router.post('/add', (req, res) => {
    res.send('Them dan cu moi');
});

module.exports = router;