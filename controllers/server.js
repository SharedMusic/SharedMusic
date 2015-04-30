var app = require('express')();
app.set('view engine', 'jade');			// Sets the view engine to jade
app.set('views', './views')			// Sets the standard view location to /views
var http = require('http').Server(app);

// ===========================================
//			  Page request operations
// ===========================================

app.get('/', function (req, res) {
	res.render('index');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});






