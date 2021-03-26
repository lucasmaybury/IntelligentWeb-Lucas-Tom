const express = require('express');
const router = express.Router();

var image = require('../controllers/images');


/* GET image */
router.route('/:name').get(image.getByName);

/* POST image */
router.route('/').post(image.insert);

module.exports = router;
