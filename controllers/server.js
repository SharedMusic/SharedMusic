var express = require('express');
var app = express();
app.set('view engine', 'jade');			// Sets the view engine to jade
app.set('views', './views')			// Sets the standard view location to /views

//make 'views' and 'documentation' folder public access
var path = require('path')
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'documentation')));

var http = require('http').Server(app);

// ===========================================
//			  Page request operations
// ===========================================

app.get('/', function (req, res) {
	res.render('index');
});


//adding next 3 get() for zero release / product page
app.get('/zero.html', function (req, res) {
        res.sendFile(path.join(__dirname, '../views/zero.html'))
});

app.get('/dev_documentation', function (req, res) {
        res.sendFile(path.join(__dirname, '../documentation/dev_documentation.pdf'))
});
/* once user documentation gets pushed to github uncomment this
app.get('/user_documentation', function(req, res) {
        res.sendFile(path.join(__dirname, '../documentation/user_documentation.pdf'))
});
*/




http.listen(3000, function(){
  console.log('listening on *:3000');
});






