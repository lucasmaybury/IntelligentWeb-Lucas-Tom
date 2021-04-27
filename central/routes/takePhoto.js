const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('takePhoto', { title: 'Take Photo' });
});

module.exports = router;

