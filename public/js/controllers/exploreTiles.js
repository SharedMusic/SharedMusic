var exploreTiles = angular.module('exploreTiles', [])
	.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

function msToTime(duration) {
  var milliseconds = parseInt((duration%1000)/100)
      , seconds = parseInt((duration/1000)%60)
      , minutes = parseInt((duration/(1000*60))%60)
      , hours = parseInt((duration/(1000*60*60))%24);

  return minutes + "m " + seconds + "s";
}

function fixResolution(resolutionURL) {
	return resolutionURL.replace("large", "t300x300");
}

function cleanTrack(track) {
	track.duration = msToTime(track.duration);
	if(!track.artwork_url) {
		track.artwork_url = track.user.avatar_url;
	}
	track.artwork_url = fixResolution(track.artwork_url);

	return track;
}

exploreTiles.controller('TileCtrl', ['$scope', '$http', 'roomstateFactory', function($scope, $http, roomstateFactory) {
	$scope.tracks =	[];

	// Adds a song to the queue
	$scope.retrieveTracks = function() {
		$.get("scrape", function(data, status) {
			var tracks = data.tracks;

			var half = data.tracks.length/2;

			$scope.tracks = [];

          	for(var i = 0; i < data.tracks.length/2; i++) {
            	$scope.tracks.push(
            	{
                //'frontTrack': cleanTrack(tracks[i]),
                //'backTrack' : cleanTrack(tracks[half+i])
                'frontTrack': tracks[i],
                'backTrack' : tracks[half+i]
            	});
          	}


  		$scope.$apply();
		});
	};

  $scope.addTrack = function(track) {
    roomstateFactory.addSong(track);
  }

  $scope.msToTime = function(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    return minutes + "m " + seconds + "s";
  }

  $scope.albumArt = function(track) {
    if (track == null) {
			return "../images/tempAlbum.png";
		}

		var art = track.artwork_url;
    if (track.artwork_url == null) {
      art = track.user.avatar_url;
    }
    art = fixResolution(art);

    return art;
  }


	$scope.retrieveTracks();
}]);

exploreTiles.directive('tile', function() {
  return {
    templateUrl: 'tile.html'
  };
});
