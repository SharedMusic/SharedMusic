requirejs.config({
	baseUrl: 'js',
	paths: {
		controllers: '../controllers'
	}
});

requirejs(['simplesets', 'controllers/user'],
function(simplesets, user){
	angular.bootstrap(document, ['users']);
});