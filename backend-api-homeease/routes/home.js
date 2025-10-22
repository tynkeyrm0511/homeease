const express = require('express');
const router = express.Router();

//Route chính
router.get('/', (req, res) => {
    res.send('Chào mừng đến với HomeEase API')
});

module.exports = router;