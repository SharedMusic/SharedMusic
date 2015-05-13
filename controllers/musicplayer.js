var musicPlayer = angular.module('musicplayer', []);

musicPlayer.controller('MusicPlayer', ['$scope', function($scope){
	var mP = this;
	mP.currentSongEpoch = null;
	mP.currentSongURL = null;
	mP.currentSong = null;

	SC.initialize({
	  client_id: '337bccb696d7b8442deedde76fae5c10'
	});

	// update the currently playing song
	mP.updateSong = function(songURL, epoch){
		// only update if a new song is given
		if (mP.currentSongURL != songURL) {
			mP.currentSongURL = songURL;
			mP.currentSongEpoch = epoch;

			// fetch track information
			SC.get("/resolve/?url="+mP.currentSongURL, {limit: 1}, function(result){
				mP.trackInfo = result;

				// apply update to the view - needed because this is a callback that excutes after
				$scope.$apply();

				// play the song when results are returned
				mP.playSong();
			});

		}
	};

	// play the song
	mP.playSong = function() {
		if (mP.trackInfo != null) {
			// SC.stream(trackPath, [options], [callback])
			SC.stream("/tracks/"+mP.trackInfo.id, function(sound){
				if (mP.currentSong != null) {
					// stop the previous playing song
					mP.currentSong.stop();
				}
				// update and play the new song
				mP.currentSong = sound;
				mP.currentSong.play();
			});
		}
	}
}]);
