requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['controllers/socket', 'controllers/user', 'controllers/music', 'controllers/exploreTiles'],
function(socket, queue, user, music){
	angular.bootstrap(document, ['socketio', 'users', 'music', 'exploreTiles']);
});