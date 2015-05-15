var musicPlayer = angular.module('musicplayer', []);

musicPlayer.controller('MusicPlayer', ['$scope', function($scope){
	var mP = this;
	mP.currentSongEpoch = null;
	mP.currentSongURL = null;
	mP.currentSong = null;

	mP.muted = false;
	mP.muteStatus = "Mute"

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
				if (result.errors == null) {
					if (result.kind != "track") {
						console.log("url is not for a song")
					} else {
						mP.trackInfo = result;

						// apply update to the view - needed because this is a callback that excutes after
						$scope.$apply();

						// play the song when results are returned
						mP.playSong();
					}
				} else {
					// error is given songURL
					console.log("error")
				}
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
				// update to the new song
				mP.currentSong = sound;

				// load the song and set position before playing
				mP.currentSong.load({
					onload: function() {
						// TODO - uncomment and test with epoch
						//mP.currentSong.setPosition((new Date).getTime() - mP.currentSongEpoch)
						mP.currentSong.setPosition(100000);
						mP.currentSong.play();
						console.log(mP.currentSong.position);
					}
				});
			});
		}
	}

	mP.muteSong = function() {
		if (mP.currentSong != null) {
			if (mP.muted) {
				mP.muted = false
				mP.muteStatus = "Mute"
				mP.currentSong.unmute()
			} else {
				mP.muted = true
				mP.muteStatus = "Unmute"
				mP.currentSong.mute()
			}

		}
	}
}]);
