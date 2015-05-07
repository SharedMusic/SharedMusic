var userList = angular.module('users', []);

userList.controller('UserController', ['$scope', 'roomstate' function($scope, roomstate){
	var userList = this;
	userList.users = roomstate.users;

	userList.addUser = function(){
		userList.users.push({name:userList.temp, id:userList.users.length})
	};
}]);
