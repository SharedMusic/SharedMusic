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
                if ((results[i].title.indexOf(search.title) > -1) &&
                    (results[i].genre.indexOf(search.genre) > -1) &&
                    (results[i].user.username.indexOf(search.user) > -1)) {
                    temp.push(results[i]);
                }
            }
            search.display = temp;
        };

        search.addSong = function(n) {
            // call add song function with the given name
            // socket.io?
            alert('Added song' + search.display[n].title);
        };
    });
