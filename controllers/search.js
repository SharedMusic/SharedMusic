/**
 * Created by Keith on 5/10/2015.
 * Controller for the search panel
 */

SC.initialize({
    client_id: '337bccb696d7b8442deedde76fae5c10' // out client ID
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

        // Duration sort order
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

        // Applies all the filters to the current search result and sorts according to duration
        search.filter = function() {
            var temp = [];
            var results = search.results;

            for (i = 0; i < results.length; i++) {
                if ((!search.title || results[i].title.toLowerCase().indexOf(search.title.toLowerCase()) > -1) &&
                    (!search.genre || results[i].genre.toLowerCase().indexOf(search.genre.toLowerCase()) > -1) &&
                    (!search.user || results[i].user.username.toLowerCase().indexOf(search.user.toLowerCase()) > -1)) {
                    temp.push(results[i]);
                }
            }
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
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };

        // Stub for adding search result to  the room
        search.addSong = function(n) {
            // call add song function with the given name
            // socket.io?
            alert('Added song: ' + search.display[n].title);
        };
    });
