requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['controllers/socket', 'controllers/user', 'controllers/music', 'controllers/exploreTiles', 'socketio'],
function(socket, queue, user, music, socketio){
	angular.bootstrap(document, ['socket', 'users', 'music', 'exploreTiles']);
});