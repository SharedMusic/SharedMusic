angular.module('users', [])
	.controller('UserController', ['$scope', function($scope){
		var userList = this;
		userList.users = [];

		userList.addUser = function(){
			userList.users.push({name:userList.temp, id:userList.users.length})
		};
	}]);
