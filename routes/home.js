const express = require('express');
const router = express.Router();

//Route chính
router.get('/', (req, res) => {
    res.send('Chao mung ban den voi HomeEase')
});

module.exports = router;