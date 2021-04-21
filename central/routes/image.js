const express = require('express');
const router = express.Router();

const image = require('../controllers/image');

/**
 * GET an image from the database by it's name
 */
router.get('/:name', image.sendImageToClient)

/**
 * POST an image to be saved to the database
 */
router.post('/', image.saveImageToDB);

module.exports = router;