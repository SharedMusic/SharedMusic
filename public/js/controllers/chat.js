var chat = angular.module('chat', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
chat.controller('ChatController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){
	$scope.receivedMessages = [];
	$scope.message = "";
    $scope.newMessage = false;
    $scope.prevHeight = 0;
	
	roomstateFactory.setupGetMesssage(function(newMessage) {
		$scope.receivedMessages.push(newMessage);
        $scope.newMessage = true;
        $scope.prevHeight = $('div.messages')[0].scrollHeight;
	});

	// Takes a string message to send to the room
  	$scope.sendMessage = function() {
  		if ($scope.message.length > 0) {
    		roomstateFactory.sendMessage($scope.message);
    	}
    	$scope.message = "";
  	}

    $scope.updateScrollArea = function() {
        if ($scope.newMessage) {
            var messages = $('div.chatStream');
            if ($scope.newMessage) {
                if (messages.scrollTop() + messages.height() + 36 >= $scope.prevHeight) {
                    messages.scrollTop($('div.messages')[0].scrollHeight);
                }
            }
        }
        $scope.newMessage = false;
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