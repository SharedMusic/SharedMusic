var musicPlayer = angular.module('musicplayer', ['socketio']);

musicPlayer.controller('MusicPlayer', ['$scope','roomstateFactory','$timeout', '$http', function($scope, roomstateFactory, $timeout, $http){
	var mP = this;
	mP.currentSongEpoch = -1;
	// mP.currentSongURL = roomstateFactory.getSong().permalink_url;
	mP.currentSong = null;
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
	roomstateFactory.setupGetSong(function(newTrackInfo, newEpoch) {
		var old = mP.trackInfo;
		mP.trackInfo = newTrackInfo;

		var oldEpoch = mP.currentSongEpoch;
		mP.currentSongEpoch = newEpoch;

		// stop the currently playing song if the next song is null
		if (mP.currentSong && !mP.trackInfo) {
			mP.currentSong.stop();
			mP.currentSong == null;
			mP.currentTrackTime = 0;
		}
		if ((!old && mP.trackInfo) || (old && mP.trackInfo && mP.currentSongEpoch != oldEpoch)) {
			// Calls SoundCloud API: SC.stream(trackPath, [options], [callback])
			SC.stream("/tracks/" + mP.trackInfo.id, function(sound){
				// Streamable check testing
				// Does not currently work ($http undefined?)
				// $http.get('http://api.soundcloud.com/tracks/'+mP.trackInfo.id+'/stream?client_id=337bccb696d7b8442deedde76fae5c10').
				// success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					// console.log(status);
					// console.log(data);
					if (mP.currentSong) {
						mP.currentSong.stop();
						mP.currentSong = null;
					}
					// update to the new song
					mP.currentSong = sound;
					mP.currentTrackTime = 0;

					// stop the old song timer
					if (mP.trackTimeUpdater) {
						clearInterval(mP.trackTimeUpdater);
					}

					// updates the song time
					/*
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
					}, 500);*/

					// load the song and set position before playing
					mP.currentSong.load({
						onload: function() {

							mP.currentSong.setVolume(mP.volume);

							while ((new Date).getTime() < mP.currentSongEpoch) {
								// wait until the delay is finished
							}
							mP.currentSong.play();

							// Once the song starts to play, update the interval
							mP.trackTimeUpdater = setInterval(function(){
								if (mP.currentSongEpoch) {
									mP.currentTrackTime = (new Date).getTime() - mP.currentSongEpoch;
								} else {
									mP.currentTrackTime = 0;
								}
								mP.currentTrackTime = Math.max(0, mP.currentTrackTime);
								$scope.$apply();

								if (!mP.trackInfo || mP.currentTrackTime > mP.trackInfo.duration) {
									mP.currentTrackTime = 0;
									clearInterval(mP.trackTimeUpdater);
								}
							}, 500);

							mP.currentSong.setPosition((new Date).getTime() - mP.currentSongEpoch);
						}
					});
				// }).
				// error(function(data, status, headers, config) {
				// 	// called asynchronously if an error occurs
				// 	// or server returns response with an error status.
				// 	console.log(status);
				// });
			});
		}
	});

	mP.millisToMinutesAndSeconds = function(millis) {
		if (mP.currentSong == null || millis == null) {
			return "0:00";
		}
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

	mP.getAlbumArt = function() {
		if (mP.trackInfo == null || mP.trackInfo.artwork_url == null) {
			return "../images/tempAlbum.jpg";
		} else {
			return mP.trackInfo.artwork_url.replace("large", "t300x300");
		}
	}

	mP.getTrackTitle = function() {
		if (mP.trackInfo == null) {
			return "";
		} else {
			return musicplayer.trackInfo.title + "by" + musicplayer.trackInfo.user.username;
		}
	}

	mP.getLink = function() {
		// Link to the SoundCloud URL containing the work
		// If the sound is private link to the profile of the creator
		if (mP.trackInfo == null) {
			return "";
		} else if (mP.trackInfo.sharing == "public") {
			return mP.trackInfo.permalink_url;
		} else {
			return mP.trackInfo.user.permalink_url;
		}
	}
}]);
