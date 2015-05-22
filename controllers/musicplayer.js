var musicPlayer = angular.module('musicplayer', ['socketio']);

musicPlayer.controller('MusicPlayer', ['$scope','roomstateFactory', function($scope, roomstateFactory, $timeout){
	var mP = this;
	mP.currentSongEpoch = -1;
	// mP.currentSongURL = roomstateFactory.getSong().permalink_url;
	mP.currentSong = null;
	
	roomstateFactory.setupGetEpoch(function(newEpoch) {
		mP.currentSongEpoch = newEpoch;
	});

	mP.muted = false;
	mP.muteStatus = "Mute";
	mP.volume = 50;

	mP.currentTrackTime = 0;
	mP.trackTimeUpdater = null;

	SC.initialize({
	  client_id: '337bccb696d7b8442deedde76fae5c10'
	});

	mP.updateVolume = function() {
		if (mP.currentSong != null) {
			mP.currentSong.setVolume(mP.volume);
		}
	}

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
	roomstateFactory.setupGetSong(function(newTrackInfo) {
		var old = mP.trackInfo;
		mP.trackInfo = newTrackInfo;

		if ((old == null && mP.trackInfo != null) || (old != null && mP.trackInfo != null && mP.trackInfo.id != old.id)) {
			// SC.stream(trackPath, [options], [callback])
			SC.stream("/tracks/"+mP.trackInfo.id, function(sound){
				if (mP.currentSong != null) {
					// stop the previous playing song
					mP.currentSong.stop();
				}
				// update to the new song
				mP.currentSong = sound;

				// stop the old song timer
				if (mP.trackTimeUpdater != null) {
					clearInterval(mP.trackTimeUpdater);
				}
				// updates the song time
				mP.trackTimeUpdater = setInterval(function(){
					mP.currentTrackTime = (new Date).getTime() - mP.currentSongEpoch + 2000;
					if 	(mP.currentTrackTime < 0) {
						mP.currentTrackTime = 0;
					}
					$scope.$apply();

					if (mP.trackInfo == null || mP.currentTrackTime > mP.trackInfo.duration) {
						mP.currentTrackTime = 0;
						clearInterval(mP.trackTimeUpdater);
					}
				}, 500);

				// load the song and set position before playing
				mP.currentSong.load({
					onload: function() {
						mP.muted = false;
						mP.muteStatus = "Mute";
						mP.currentSong.unmute();

						mP.currentSong.setPosition((new Date).getTime() - mP.currentSongEpoch);
						mP.currentSong.setVolume(mP.volume);
						mP.currentSong.play();
						console.log(mP.currentSong.position);
					}
				});
			});
		}
	});

	mP.millisToMinutesAndSeconds = function(millis) {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
	};

	mP.muteSong = function() {
		if (mP.currentSong != null) {
			if (mP.muted) {
				mP.muted = false;
				mP.muteStatus = "Mute";
				mP.currentSong.unmute();
			} else {
				mP.muted = true;
				mP.muteStatus = "Unmute";
				mP.currentSong.mute();
			}
		}
	}
}]);
