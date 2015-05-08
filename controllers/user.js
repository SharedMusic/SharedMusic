var userList = angular.module('users', []);

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
		uL.users.push({name:uL.temp, id:uL.users.length})
	};
}]);
