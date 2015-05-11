var musicPlayer = angular.module('musicplayer', []);

musicPlayer.controller('MusicPlayer', ['$scope', function($scope){
	var mP = this;
	mP.currentSongEpoch = null;
	mP.currentSongURL = null;

	mP.updateSong = function(songURL, epoch){
		mP.currentSongURL = songURL;
		mP.currentSongEpoch = epoch;

		SC.initialize({
		  client_id: '337bccb696d7b8442deedde76fae5c10'
		});

		// fetch track information
		mP.trackInfo = SC.get('/tracks/293')

		// get the tracks streaming URL
		//stream_url = SC.get(track.stream_url, :allow_redirects => false)

		// SC.stream(trackPath, [options], [callback])
		SC.stream("/tracks/293", function(sound){
		  sound.play();
		});
	};
}]);
