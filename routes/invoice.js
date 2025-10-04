const express = require('express');
const router = express.Router();

//Route: lay danh sach hoa don
router.get('/', (req, res) => {
    res.send('Danh sach hoa don');
});

//Route: them hoa don
router.post('/create', () => {
    res.send('Tao hoa don moi');
});

module.exports = router;