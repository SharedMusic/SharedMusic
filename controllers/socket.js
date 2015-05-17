var socketio = angular.module('socketio', []);

// Roomstate Factory
// Uncomment the 'socket' dependency once we have socketio able to run
socketio.factory('roomstateFactory', ['socket', function(socket){
	var rs = this;
	var user = -1; // This should be set to the user's ID
	var current;
	var users = [];
	var queue = [];
	var epoch = -1;
	var bootVotes = [];
	var myRoomID = -1;
	var myUserID = -1;
	var myName = "";

	var updateUsersFn = null;
	var updateQueueFn = null;
	var updateCurrentFn = null;
	var updateEpochFn = null;

	socket.on('onRoomUpdate', 
		function(roomState) {
			//console.log('helloworld');
			updateUsersFn(roomState.users);
			updateQueueFn(roomState.trackQueue);
			if(roomState.trackQueue.length > 0)
				updateCurrentFn(roomState.trackQueue[0]);
			else 
				updateCurrentFn(null);
			updateEpochFn(roomState.currentSongEpoch);
		});

	socket.on('userInfo', 
		function(name, id) {
			myName = name;
			myUserID = id;
		});

	socket.on('onError', function(error) {
		console.log(error);
	});


	return {
		// Returns list of users in current room
		setupGetUsers: function (updateUsersCallback){
			updateUsersFn = updateUsersCallback;
		},

		// Test function, will remove later
		addUser: function (roomID, name){
			myRoomID = roomID;
			socket.emit('joinRoom', {roomID: roomID, name: name });
		},

		// Returns song Queue
		setupGetQueue: function(updateQueueCallback){
			updateQueueFn = updateQueueCallback;
		},

		// Returns current song
		setupGetSong: function(updateSongCallback){
			updateCurrentFn = updateSongCallback;
		},
		// Returns current song epoch
		setupGetEpoch: function(updateEpochCallback){
			updateEpochFn = updateEpochCallback;
		},

		// Returns list of boot votes
		getBootVotes: function(){
			return bootVotes;
		},

		// Tells the server to add a song to the queue
		addSong: function(song){
			socket.emit('addTrack', {roomID: myRoomID, userID: myUserID, track:song });
		},

		nextSong: function(){
			if(queue[0] != null){
				current = queue[0];
				queue.shift();
			}
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