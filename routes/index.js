var express = require('express'),
	path = require('path'),
	request = require('request'),
	router = express.Router(),
	architecture = require('../architecture'),
	Room = architecture.Room,
	User = architecture.User,
	io = require('../app.js'),
	uuid = require('uuid');


router.get('/createRoom', function(req, res){
	var uRoomID = uuid.v4();
	var newRoom = new Room('NewRoom', uRoomID, io.onRoomChange(uRoomID));

	io.rooms[uRoomID] = newRoom;
	console.log('redirecting');
	res.redirect('/room/?roomID=' + uRoomID);
})

router.get('/room', function (req, res) {
	var room = io.rooms[req.param.roomID];
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname, '../views/app3.html'));
});


/*
	For UI Testing and app2.html
*/

router.get('/createRoom2', function(req, res){
	var uRoomID = uuid.v4();
	var newRoom = new Room('NewRoom', uRoomID, io.onRoomChange(uRoomID));

	io.rooms[uRoomID] = newRoom;
	console.log('redirecting');
	res.redirect('/room2/?roomID=' + uRoomID);
})

router.get('/room2', function (req, res) {
	var room = io.rooms[req.param.roomID];
	// Pass room to the view and return view to client
	res.sendFile(path.join(__dirname, '../views/app2.html'));
});

router.get('/room2/scrape', function (req, res) {
	url = 'https://api-v2.soundcloud.com/explore/Popular+Music?tag=out-of-experiment&limit=200&offset=0';

	request(url, function(error, response, html) {
		if(!error) {
			res.setHeader('Content-Type', 'application/json');
			res.end(html);
		}
	})
});

/*
	End UI Testing and app2.html
*/

// for zero release / product page
router.get('/zero', function (req, res) {
	res.sendFile(path.join(__dirname, '../views/zero.html'))
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

router.get('/room/scrape', function (req, res) {
	url = 'https://api-v2.soundcloud.com/explore/Popular+Music?tag=out-of-experiment&limit=200&offset=0';

	request(url, function(error, response, html) {
		if(!error) {
			res.setHeader('Content-Type', 'application/json');
			res.end(html);
		}
	})
});

module.exports = router;
