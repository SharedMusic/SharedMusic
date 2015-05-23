requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['/controllers/exploreTiles.js', '/controllers/socket.js', '/controllers/user.js', '/controllers/music.js', '/controllers/exploreTiles.js', '/controllers/musicplayer.js', '/controllers/search.js', '/controllers/bootVotes.js'],
function(socket, user, queue, music){
	angular.bootstrap(document, ['socketio', 'users', 'music', 'exploreTiles', 'musicplayer', 'search', 'bootVotes']);
});