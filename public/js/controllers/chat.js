var musicList = angular.module('chat', ['socketio']);

// User List Controller
// Depends on roomstateFactory to see the current roomstate
musicList.controller('ChatController', ['$scope', 'roomstateFactory', function($scope, roomstateFactory){
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
        var messages = $('div.messages');
        if ($scope.newMessage) {
            console.log(messages.scrollTop());
            console.log($scope.prevHeight);
            if (messages.scrollTop() == $scope.prevHeight) {
                messages.scrollTop(messages.height());
                $scope.newMessage = false;
            } else {
                console.log("You were looking elsewhere");
            }
        }
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