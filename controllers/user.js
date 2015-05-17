var userList = angular.module('users', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
userList.controller('UserController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){

	var uL = this;
	uL.users = [];

	roomstateFactory.setupGetUsers(function(users) {
		uL.users = users;
	});

	// Add a new user to the room
	uL.addUser = function(){
		// This currently pushes and pulls from the roomstateFactory
		roomstateFactory.addUser(uL.temp.roomID, uL.temp.name);
	};

	// Updates the user list
	uL.update = function(nUsers){
		this.users = nUsers;
	}
}]);
