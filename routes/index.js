var express = require('express');
var path = require('path');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', function (req, res) {
	res.render('index');
});


//adding next 3 get() for zero release / product page
router.get('/zero.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/zero.html'))
});

router.get('/dev_documentation', function (req, res) {
	res.sendFile(path.join(__dirname, '../documentation/dev_documentation.pdf'))
});

router.get('/user_documentation', function (req, res) {
	res.sendFile(path.join(__dirname, '../documentation/user_documentation.pdf'))
});

// GET app page
router.get('/app.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/app.html'))
});

router.get('/controllers/user.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/user.js'))
});

router.get('/js/simplesets.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/simplesets.js'))
});

router.get('/js/main.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/main.js'))
});

router.get('/js/require.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/require.js'))
});


module.exports = router;
