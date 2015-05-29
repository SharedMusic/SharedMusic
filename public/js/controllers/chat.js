var musicList = angular.module('chat', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
musicList.controller('ChatController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){
	$scope.receivedMessages = [];
	$scope.message = "";
	
	roomstateFactory.setupGetMesssage(function(newMessage) {
		$scope.receivedMessages.push(newMessage);
	});

	// Takes a string message to send to the room
  	$scope.sendMessage = function() {
  		if ($scope.message.length > 0) {
    		roomstateFactory.sendMessage($scope.message);
    	}
    	$scope.message = "";
  	}
}]);

musicList.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});