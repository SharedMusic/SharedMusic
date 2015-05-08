requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['simplesets', 'queue', 'controllers/user', 'controllers/music'],
function(simplesets, queue, user, music){
	angular.bootstrap(document, ['users', 'music']);
});