var userList = angular.module('users', []);

userList.service('roomstate', function(){
	var rs = this;
	// this.test = new Set();
});

userList.controller('UserController', ['$scope', 'roomstate', function($scope, roomstate){
	var uL = this;
	uL.users = roomstate.users;

	uL.addUser = function(){
		uL.users.push({name:uL.temp, id:uL.users.length})
	};
}]);
