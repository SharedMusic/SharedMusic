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

exploreTiles.controller('TileCtrl', ['$scope', '$http', '$document', 'roomstateFactory', function($scope, $http, $document, roomstateFactory) {
	$scope.tracks =	[];

  var tiles = [ {id: "t100-1", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "0", top: "0"},
                {id: "t100-2", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "0", top: "100"},
                {id: "t100-3", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "0", top: "400"},
                {id: "t100-4", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "100", top: "400"},
                {id: "t100-5", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "300", top: "500"},
                {id: "t100-6", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "400", top: "500"},
                {id: "t100-7", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "600", top: "300"},
                {id: "t100-8", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "500", top: "300"},
                {id: "t100-9", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "600", top: "0"},
                {id: "t100-10", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "500", top: "0"},
                {id: "t100-11", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "700", top: "0"},
                {id: "t100-12", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "700", top: "100"},
                {id: "t100-13", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "800", top: "400"},
                {id: "t100-14", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "800", top: "500"},
                {id: "t100-15", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "900", top: "200"},
                {id: "t100-16", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "500", top: "700"},
                {id: "t100-17", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "200", top: "800"},
                {id: "t100-18", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "0", top: "1000"},
                {id: "t100-19", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "100", top: "1000"},
                {id: "t100-20", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "200", top: "1000"},
                {id: "t100-21", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "200", top: "900"},
                {id: "t100-22", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "800", top: "800"},
                {id: "t100-23", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "800", top: "900"},
                {id: "t100-24", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "800", top: "1000"},
                {id: "t100-25", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1000", top: "600"},
                {id: "t100-26", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1000", top: "700"},
                {id: "t100-27", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1200", top: "500"},
                {id: "t100-28", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1400", top: "400"},
                {id: "t100-29", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1500", top: "400"},
                {id: "t100-30", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1500", top: "0"},
                {id: "t100-31", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1500", top: "100"},
                {id: "t100-32", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1300", top: "200"},
                {id: "t100-33", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1400", top: "800"},
                {id: "t100-34", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1500", top: "800"},
                {id: "t100-35", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1200", top: "1000"},
                {id: "t100-36", imageLen: 40, imageBorder: 30, width: 100, cls: "s100", left: "1300", top: "1000"},
                {id: "t200-1", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "100", top: "0"},
                {id: "t200-2", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "0", top: "200"},
                {id: "t200-3", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "300", top: "600"},
                {id: "t200-4", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "700", top: "200"},
                {id: "t200-5", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "300", top: "0"},
                {id: "t200-6", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "500", top: "100"},
                {id: "t200-7", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "800", top: "0"},
                {id: "t200-8", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "800", top: "600"},
                {id: "t200-9", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "600", top: "700"},
                {id: "t200-10", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "0", top: "800"},
                {id: "t200-11", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "600", top: "900"},
                {id: "t200-12", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1100", top: "600"},
                {id: "t200-13", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1200", top: "300"},
                {id: "t200-14", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1400", top: "200"},
                {id: "t200-15", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1300", top: "0"},
                {id: "t200-16", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1200", top: "800"},
                {id: "t200-17", imageLen: 80, imageBorder: 60, width: 200, cls: "s200", left: "1400", top: "900"},
                {id: "t300-1", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "200", top: "200"},
                {id: "t300-2", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "0", top: "500"},
                {id: "t300-3", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "500", top: "400"},
                {id: "t300-4", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "900", top: "300"},
                {id: "t300-5", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "1000", top: "0"},
                {id: "t300-6", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "300", top: "800"},
                {id: "t300-7", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "900", top: "800"},
                {id: "t300-8", imageLen: 120, imageBorder: 90, width: 300, cls: "s300", left: "1300", top: "500"}];

	// Adds a song to the queue
	$scope.retrieveTracks = function() {
		$.get("scrape", function(data, status) {
			var tracks = data.tracks;

			var half = Math.floor(data.tracks.length/2);

			$scope.tracks = [];
          	for(var i = 0; i < data.tracks.length/2; i++) {
              if (i < tiles.length) {
                $scope.tracks.push(
              {
                //'frontTrack': cleanTrack(tracks[i]),
                //'backTrack' : cleanTrack(tracks[half+i])
                'frontTrack': data.tracks[i],
                'backTrack' : data.tracks[half+i],
                'format' : tiles[i]
              });
              }
          	}
  		$scope.$apply();
		});
	};

  $scope.addTrack = function(track) {
    // call add song function with the given name
            // socket.io?
           $http.get('https://api.soundcloud.com/tracks/' + track.id+ '/stream?client_id=337bccb696d7b8442deedde76fae5c10')
               .success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
        //            console.log(status);
        //            console.log(data);
                    roomstateFactory.addSong(track);
            //$scope.$apply();
            //alert('Added song: ' + search.display[n].permalink_url);

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                var newDirective = angular.element('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Oops! Something went wrong!</div>');
                var body = $document.find('#tiles').eq(0);
                body.append(newDirective);
                $compile(newDirective)($scope);
                window.setTimeout(function() { 
                    $(".alert").fadeOut('slow', function() {
                        $(".alert").alert('close');
                    });}, 5000);
                console.log(status);
            });
    // roomstateFactory.addSong(track);
  }

  $scope.msToTime = function(duration) {
		var hours = parseInt((duration/(1000*60*60))%24);
		var minutes = parseInt((duration/(1000*60))%60);
		var seconds = parseInt((duration/1000)%60);

		var time = ""
		if (hours > 0) {
			time = hours + ":" + (minutes < 10 ? '0' : '');
		}
		time = time + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		return time;
  }

  $scope.albumArt = function(track) {
    if (!track) {
			return "../images/tempAlbum.jpg";
		}

		var art = track.artwork_url;
    if (!track.artwork_url) {
      return track.user.avatar_url;
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
