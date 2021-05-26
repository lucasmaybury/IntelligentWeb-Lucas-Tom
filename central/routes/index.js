const express = require('express');
const router = express.Router();

/**
 * GET home page and render it in browser
 * */
router.get('/', function(req, res) {
  res.render('index', { title: 'Image Browsing' });
});

/* POST from form. */
router.post('/', function (req, res, next) {
  let name = req.body.name;
  let title = req.body.title;
  let description = req.body.description;
  let authorName = req.body.authorName;
  let image = req.body.image;
});

module.exports = router;