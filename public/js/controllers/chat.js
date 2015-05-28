var musicList = angular.module('chat', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
musicList.controller('ChatController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){
	var receivedMessages = [];
	
	roomstateFactory.setupGetMesssage(function(newMessage) {
		receivedMessages.push(newMessage);
	});

	// Takes a string message to send to the room
  	$scope.sendMessage = function(message) {
    	roomstateFactory.sendMessage(message);
  	}
}]);