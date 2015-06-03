/**
 * Created by Keith on 5/10/2015.
 * Controller for the search panel
 */

SC.initialize({
    client_id: '337bccb696d7b8442deedde76fae5c10' // our client ID
});

angular.module('search', ['socketio'])
    .controller('SearchController', ['$scope', 'roomstateFactory', '$http', '$document', '$compile', function($scope, roomstateFactory, $http, $document, $compile) {
        var search = this;

        // Result of the most recent search
        search.results = [];

        // Results to display based on filters
        search.display = [];

        // Arguments fo the filters
        search.genre = "";
        search.title = "";
        search.user = "";
		  search.remix = "";

        // Duration sort order
        search.ascending= false;

        // Default page size
        search.pageSize = 100;

        // Searches sound clound with the given query
        search.search = function(query) {
				//clear filters on each new search
				search.genre = "";
				search.title = "";
				search.user = "";

            SC.get('/tracks', { q: search.query, filter: 'streamable', limit: search.pageSize}, function(tracks) {
                search.results = tracks;
                search.display = tracks;

					//display nothing/clear results when blank search
					if (query == "" ) {
						search.results = []
						search.display = []
					}

               $scope.$apply();
               $('.searchResContainer').css({top: "66px"});
               $('input.clearSearchButtom').fadeIn(400);
               $('.tiles').animate({top: "100%"}, 400);
            });
        };

        search.clearSearch = function() {
           $('input.clearSearchButtom').hide();
           $('input.displaySearchButtom').show();
           $('.tiles').animate({top: "0px"}, 400);
        };

        search.displaySearch = function() {
            $('input.clearSearchButtom').show();
            $('input.displaySearchButtom').hide();
            $('.tiles').animate({top: "100%"}, 400);
        }

        $scope.filter = function (query) {
            search.filter();
        };

        // Applies all the filters to the current search result and sorts according to duration
        search.filter = function() {
            var temp = [];
            var results = search.results;



            for (i = 0; i < results.length; i++) {

					 //bug fix: some genres are null, so filtering on null is erroring
			  		 var genre = results[i].genre

                if ((!search.title || results[i].title.toLowerCase().indexOf(search.title.toLowerCase()) > -1) &&
                    (!search.genre || (genre != null && results[i].genre.toLowerCase().indexOf(search.genre.toLowerCase()) > -1)) &&
                    (!search.user || results[i].user.username.toLowerCase().indexOf(search.user.toLowerCase()) > -1) &&
						  (!search.remix || results[i].title.toLowerCase().indexOf(search.remix.toLowerCase()) == -1)) {
                    temp.push(results[i]);
                }
            }

            temp.sort(function(track1, track2) {
                if (track1.duration < track2.duration) {
                    return search.ascending ? -1 : 1;
                } else if (track1.duration > track2.duration) {
                    return search.ascending ? 1 : -1;
                } else {
                    return 0;
                }
            });

            search.display = temp;
        };


        // Sorts the current displayed results by order of duration
        search.sortByDuration = function() {
            search.display = search.display.sort(function(track1, track2) {
                if (track1.duration < track2.duration) {
                    return search.ascending ? -1 : 1;
                } else if (track1.duration > track2.duration) {
                    return search.ascending ? 1 : -1;
                } else {
                    return 0;
                }
            });
        };

        // Converts the given time in milliseconds to a string representing that time in minutes and seconds
        search.millisToMinutesAndSeconds = function(millis) {
          var hours = parseInt((millis/(1000*60*60))%24);
      		var minutes = parseInt((millis/(1000*60))%60);
      		var seconds = parseInt((millis/1000)%60);

      		var time = ""
      		if (hours > 0) {
      			time = hours + ":" + (minutes < 10 ? '0' : '');
      		}
      		time = time + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      		return time;
      	};

        // Stub for adding search result to  the room
        search.addSong = function(n) {
            // call add song function with the given name
            // socket.io?
           $http.get('https://api.soundcloud.com/tracks/' + search.display[n].id+ '/stream?client_id=337bccb696d7b8442deedde76fae5c10')
               .success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
        //            console.log(status);
        //            console.log(data);
                    roomstateFactory.addSong(search.display[n]);
            //$scope.$apply();
            //alert('Added song: ' + search.display[n].permalink_url);

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                // TODO: Write new error handling here or edit current div to look pretty on the page
                var newDirective = angular.element('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Oops! Something went wrong!</div>');
                var body = $document.find('#searchResHeader').eq(0);
                body.append(newDirective);
                $compile(newDirective)($scope);
                window.setTimeout(function() { 
                    $(".alert").fadeOut('slow', function() {
                        $(".alert").alert('close');
                    });}, 5000);
                console.log(status);
            });

        };
    }]);
