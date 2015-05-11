/**
 * Created by Keith on 5/10/2015.
 * Controller for the search panel
 */

SC.initialize({
    client_id: '337bccb696d7b8442deedde76fae5c10'
});

angular.module('search', [])
    .controller('SearchController', function() {
        var search = this;

        // Result of the most recent search
        search.results = [];

        // Results to display based on filters
        search.display = [];

        // Arguments fo the filters
        search.genre = "";
        search.title = "";
        search.user = "";
        search.ascending= false;

        // Default page size
        search.pageSize = 100;

        // Searches sound hound with the given query
        search.search = function(query) {
            SC.get('/tracks', { q: search.query, limit: search.pageSize}, function(tracks) {
                search.results = tracks;
                search.display = tracks;
            });
        };

        // Applies all the filters to the current search result
        search.filter = function() {
            var temp = [];
            var results = search.results;

            for (i = 0; i < results.length; i++) {
                if ((results[i].title.toLowerCase().indexOf(search.title.toLowerCase()) > -1) &&
                    (results[i].genre.toLowerCase().indexOf(search.genre.toLowerCase()) > -1) &&
                    (results[i].user.username.toLowerCase().indexOf(search.user.toLowerCase()) > -1)) {
                    temp.push(results[i]);
                }
            }
            temp = sortByDuration(temp);
            search.display = temp;
        };

        var sortByDuration = function(tracks) {
            return tracks.sort(function(track1, track2) {
                if (search.ascending) {
                    if (track1.duration <= track2.duration) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    if (track1.duration >= track2.duration) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
        };

        search.addSong = function(n) {
            // call add song function with the given name
            // socket.io?
            alert('Added song' + search.display[n].title);
        };
    });
