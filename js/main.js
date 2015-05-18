requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['controllers/exploreTiles', 'controllers/socket', 'controllers/user', 'controllers/music', 'controllers/exploreTiles', 'controllers/musicplayer', 'controllers/search'],
function(socket, user, queue, music){
	angular.bootstrap(document, ['socketio', 'users', 'music', 'exploreTiles', 'musicplayer', 'search']);
});