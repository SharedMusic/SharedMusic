var socketio = angular.module('socketio', []);

// Roomstate Factory
// Uncomment the 'socket' dependency once we have socketio able to run
socketio.factory('roomstateFactory', [/*'socket',*/ function(){
	var rs = this;
	var user = -1; // This should be set to the user's ID
	var users = [];
	var queue = [];
	var epoch = -1;
	var bootVotes = [];

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
		},

		// Returns current song epoch
		getEpoch: function(){
			return epoch;
		},

		// Returns list of boot votes
		getBootVotes: function(){
			return bootVotes;
		},

		// Tells the server to add a song to the queue
		addSong: function(){
			// Socket io call
		},

		// Tells the server the current user wants to vote
		addBootVote: function(){
			// Socket io clal
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