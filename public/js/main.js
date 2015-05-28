requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['/js/controllers/socket.js', '/js/controllers/user.js', '/js/controllers/music.js', '/js/controllers/exploreTiles.js', '/js/controllers/musicplayer.js', '/js/controllers/search.js', '/js/controllers/bootVotes.js', '/js/controllers/chat.js'],
function(socket, user, queue, music){
	angular.bootstrap(document, ['socketio', 'users', 'music', 'exploreTiles', 'musicplayer', 'search', 'bootVotes', 'chat']);
});