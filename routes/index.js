var express = require('express');
var path = require('path');
var request = require('request');
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

router.get('/tiletest.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/tiletest.html'))
});

router.get('/tile.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/tile.html'))
});

router.get('/search.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/search.html'))
});

router.get('/musicplayer.html', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/musicplayer.html'))
});

// GET angular controllers
router.get('/controllers/socket.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/socket.js'))
});

router.get('/controllers/user.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/user.js'))
});

router.get('/controllers/music.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/music.js'))
});

router.get('/controllers/exploreTiles.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/exploreTiles.js'))
});

router.get('/controllers/search.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/search.js'))
});

router.get('/controllers/musicplayer.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../controllers/musicplayer.js'))
});

// GET other js files
router.get('/js/socketio.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/socketio.js'))
});

router.get('/js/metrojs.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/metrojs.js'))
});

router.get('/js/tiles.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/tiles.js'))
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

router.get('/js/queue.js', function (req, res) {
	res.sendFile(path.join(__dirname, '../js/queue.js'))
});

router.get('/js/metrojs.js', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(__dirname + '/js/metrojs.js');
});

// GET other css files
router.get('/style/metrojs.css', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname, '../style/metrojs.css'));
});

router.get('/style/tiletest.css', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname, '../style/tiletest.css'));
});

// GET images
router.get('/images/addsong.png', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname,'../images/AddSong.png'));
});

router.get('/images/soundcloud.png', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname,'../images/SoundCloud.png'));
});

router.get('/images/addsong_dark.png', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname,'../images/AddSong_Dark.png'));
});

router.get('/images/soundcloud_dark.png', function (req, res) {
	var room = req.room;
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname, '../images/SoundCloud_Dark.png'));
});

router.get('/scrape', function (req, res) {
	url = 'https://api-v2.soundcloud.com/explore/Popular+Music?tag=out-of-experiment&limit=200&offset=0';

	request(url, function(error, response, html) {
		if(!error) {
			res.setHeader('Content-Type', 'application/json');
			res.end(html);
		}
	})
});

module.exports = router;
