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

  var tiles = [ {id: "t100-1", cls: "s100", left: "0", top: "0"},
                {id: "t100-2", cls: "s100", left: "0", top: "100"},
                {id: "t100-3", cls: "s100", left: "0", top: "400"},
                {id: "t100-4", cls: "s100", left: "100", top: "400"},
                {id: "t100-5", cls: "s100", left: "300", top: "500"},
                {id: "t100-6", cls: "s100", left: "400", top: "500"},
                {id: "t100-7", cls: "s100", left: "600", top: "300"},
                {id: "t100-8", cls: "s100", left: "500", top: "300"},
                {id: "t100-9", cls: "s100", left: "600", top: "0"},
                {id: "t100-10", cls: "s100", left: "500", top: "0"},
                {id: "t100-11", cls: "s100", left: "700", top: "0"},
                {id: "t100-12", cls: "s100", left: "700", top: "100"},
                {id: "t100-13", cls: "s100", left: "800", top: "400"},
                {id: "t100-14", cls: "s100", left: "800", top: "500"},
                {id: "t100-15", cls: "s100", left: "900", top: "200"},
                {id: "t100-16", cls: "s100", left: "500", top: "700"},
                {id: "t100-17", cls: "s100", left: "200", top: "800"},
                {id: "t100-18", cls: "s100", left: "0", top: "1000"},
                {id: "t100-19", cls: "s100", left: "100", top: "1000"},
                {id: "t100-20", cls: "s100", left: "200", top: "1000"},
                {id: "t100-21", cls: "s100", left: "200", top: "900"},
                {id: "t100-22", cls: "s100", left: "800", top: "800"},
                {id: "t100-23", cls: "s100", left: "800", top: "900"},
                {id: "t100-24", cls: "s100", left: "800", top: "1000"},
                {id: "t100-25", cls: "s100", left: "1000", top: "600"},
                {id: "t100-26", cls: "s100", left: "1000", top: "700"},
                {id: "t100-27", cls: "s100", left: "1200", top: "500"},
                {id: "t100-28", cls: "s100", left: "1400", top: "400"},
                {id: "t100-29", cls: "s100", left: "1500", top: "400"},
                {id: "t100-30", cls: "s100", left: "1500", top: "0"},
                {id: "t100-31", cls: "s100", left: "1500", top: "100"},
                {id: "t100-32", cls: "s100", left: "1300", top: "200"},
                {id: "t100-33", cls: "s100", left: "1400", top: "800"},
                {id: "t100-34", cls: "s100", left: "1500", top: "800"},
                {id: "t100-35", cls: "s100", left: "1200", top: "1000"},
                {id: "t100-36", cls: "s100", left: "1300", top: "1000"},
                {id: "t200-1", cls: "s200", left: "100", top: "0"},
                {id: "t200-2", cls: "s200", left: "0", top: "200"},
                {id: "t200-3", cls: "s200", left: "300", top: "600"},
                {id: "t200-4", cls: "s200", left: "700", top: "200"},
                {id: "t200-5", cls: "s200", left: "300", top: "0"},
                {id: "t200-6", cls: "s200", left: "500", top: "100"},
                {id: "t200-7", cls: "s200", left: "800", top: "0"},
                {id: "t200-8", cls: "s200", left: "800", top: "600"},
                {id: "t200-9", cls: "s200", left: "600", top: "700"},
                {id: "t200-10", cls: "s200", left: "0", top: "800"},
                {id: "t200-11", cls: "s200", left: "600", top: "900"},
                {id: "t200-12", cls: "s200", left: "1100", top: "600"},
                {id: "t200-13", cls: "s200", left: "1200", top: "300"},
                {id: "t200-14", cls: "s200", left: "1400", top: "200"},
                {id: "t200-15", cls: "s200", left: "1300", top: "0"},
                {id: "t200-16", cls: "s200", left: "1200", top: "800"},
                {id: "t200-17", cls: "s200", left: "1400", top: "900"},
                {id: "t300-1", cls: "s300", left: "200", top: "200"},
                {id: "t300-2", cls: "s300", left: "0", top: "500"},
                {id: "t300-3", cls: "s300", left: "500", top: "400"},
                {id: "t300-4", cls: "s300", left: "900", top: "300"},
                {id: "t300-5", cls: "s300", left: "1000", top: "0"},
                {id: "t300-6", cls: "s300", left: "300", top: "800"},
                {id: "t300-7", cls: "s300", left: "900", top: "800"},
                {id: "t300-8", cls: "s300", left: "1300", top: "500"}];

	// Adds a song to the queue
	$scope.retrieveTracks = function() {
		$.get("scrape", function(data, status) {
			var tracks = data.tracks;

			var half = data.tracks.length/2;

			$scope.tracks = [];
          	for(var i = 0; i < tiles.length; i++) {
            	$scope.tracks.push(
            	{
                //'frontTrack': cleanTrack(tracks[i]),
                //'backTrack' : cleanTrack(tracks[half+i])
                'frontTrack': tracks[i],
                'backTrack' : tracks[half+i],
                'format' : tiles[i]
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
