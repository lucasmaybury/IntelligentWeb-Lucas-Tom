var express = require('express');
var router = express.Router();

var image = require('../controllers/image');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pied Piper' });
});

router.get('/image/:name', image.sendImageToClient)

router.post('/image', image.saveImageToDB);


module.exports = router;
