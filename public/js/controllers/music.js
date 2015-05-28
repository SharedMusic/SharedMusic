var musicList = angular.module('music', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
musicList.controller('MusicController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){
	var mL = this;
	mL.queue = [];
	current = [];

	console.log("hello");
	roomstateFactory.setupGetQueue(function(queue) {
		mL.queue = queue;
	});

	// Add a new user to the room
	mL.addUser = function(){
		// This currently pushes and pulls from the roomstateFactory
		roomstateFactory.addUser(mL.temp);
		mL.users = roomstateFactory.getUsers();
	};

	// Updates the song queue
	mL.update = function(nQueue){
		this.queue = [{title:'heyo', id:1}];
	}
}]);
