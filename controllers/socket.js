var socketio = angular.module('socketio', []);

// Roomstate Factory
// Uncomment the 'socket' dependency once we have socketio able to run
socketio.factory('roomstateFactory', [/*'socket',*/ function(){
	var rs = this;
	var users = [];
	var queue = [];
	return {
		// Returns list of users in current room
		getUsers: function (){
			return users;
		},

		// Test function, will remove later
		addUser: function (name){
			users.push({name:name, id:users.length})
		},

		// Returns song Queue
		getQueue: function(){
			return queue;
		},

		// Returns current song
		getSong: function(){
			if(queue.length > 0){
				return queue[0];
			}else{
				// No songs in queue
			}
		} 
	}
}]);

// Socketio factory
// This essentially exposes an API that we can use to set
// on: and emit: functions for anything on any page we want
socketio.factory('socket', function ($rootScope) {
	var socket = io();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});