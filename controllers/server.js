var express = require('express');
var app = express();	
app.set('view engine', 'jade');			// Sets the view engine to jade
app.set('views', './views')			// Sets the standard view location to /views
app.listen(1234);						// The localhost port of the server


// ===========================================
//			  Page request operations
// ===========================================

app.get('/', function (req, res) {
	console.log('send index page');
	res.render('index');
});








