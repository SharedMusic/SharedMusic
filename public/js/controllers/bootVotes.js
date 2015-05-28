var bootVotes = angular.module('bootVotes', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
bootVotes.controller('BootVotes', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){

	var bV = this;
	bV.bootCount = 0;
	bV.userCount = 0;

	//What to do here...
	roomstateFactory.setupBootVote(function(bootVotesCount, userCount) {
		bV.bootCount = bootVotesCount;
		bV.userCount = Math.ceil(userCount / 2);
	});

	// Add a new user to the room
	bV.addBootVote = function(){
		roomstateFactory.addBootVote();
	};
}]);
