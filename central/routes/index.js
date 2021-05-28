const express = require('express');
const router = express.Router();

/**
 * GET home page and render it in browser
 * */
router.get('/', function(req, res) {
  res.render('index', { title: 'Image Browsing' });
});


module.exports = router;