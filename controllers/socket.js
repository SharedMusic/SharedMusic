var userList = angular.module('socket', []);

// Need to remove this as soon as we figure out how to get the roomstate in as a dependency
userList.service('roomstate', function(){
	var rs = this;
	this.users = [];
	// this.test = new Set();
});

// User List Controller
userList.controller('UserController', ['$scope', 'roomstate', function($scope, roomstate){
	var uL = this;
	uL.users = roomstate.users;

	// Add a new user to the room
	uL.addUser = function(){
		// This currently just pushes to an array in roomstate, this will need to make a request to the server
		for(var i = 0; i < 10; i++){
			uL.users.push({name:i, id:uL.users.length})
		}
	};
}]);
