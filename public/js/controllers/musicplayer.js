var musicPlayer = angular.module('musicplayer', ['socketio']);


var average = function(array) {
	var avg = 0;
	for (i = 0; i < array.length; i++) {
		avg += array[i];
	}
	return avg / array.length;
}

musicPlayer.controller('MusicPlayer', ['$scope','roomstateFactory','$timeout', '$http', function($scope, roomstateFactory, $timeout, $http){
	var mP = this;
	mP.currentSongEpoch = -1;
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

	// play the song
	roomstateFactory.setupGetSong(function(newTrackInfo, newEpoch) {
		// stop the currently playing song if the next song is null
		if (mP.currentSong && newEpoch != mP.currentSongEpoch) {
			mP.currentSong.stop();
			mP.currentSong = null;
		}

		if (newTrackInfo && newEpoch && newEpoch != mP.currentSongEpoch) {
			// Calls SoundCloud API: SC.stream(trackPath, [options], [callback])
			SC.stream("/tracks/" + newTrackInfo.id, function(sound){
				console.log("happened");
				// Streamable check testing
				// Does not currently work ($http undefined?)
				// $http.get('http://api.soundcloud.com/tracks/'+mP.trackInfo.id+'/stream?client_id=337bccb696d7b8442deedde76fae5c10').
				// success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					// console.log(status);
					// console.log(data);

					// update to the new song
					mP.currentSong = sound;
					mP.currentSong.timeDiffs = [];
					mP.currentSong.trackInfo = newTrackInfo;
					mP.currentSongEpoch = newEpoch;
					mP.currentTrackTime = 0;

					// stop the old song timer
					if (mP.trackTimeUpdater) {
						clearInterval(mP.trackTimeUpdater);
					}

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
								mP.currentTrackTime = Math.max(0, 
									(mP.currentSongEpoch) ? (new Date).getTime() - mP.currentSongEpoch : 0);

								$scope.$apply();

								if (!mP.currentSong || mP.currentTrackTime > mP.currentSong.trackInfo.duration) {
									clearInterval(mP.trackTimeUpdater);
									mP.currentTrackTime = 0;
								} else if (!mP.currentSong.positionSet) {
									mP.currentSong.setPosition((new Date).getTime() - mP.currentSongEpoch);
									mP.currentSong.positionSet = true;
									mP.currentSong.lastDiffAdjustment = 0;
								} else if (!mP.currentSong.positionFixed) {
									var expectedPosition = (new Date).getTime() - mP.currentSongEpoch;
									mP.currentSong.timeDiffs.push(expectedPosition - mP.currentSong.position);
									console.log(mP.currentSong.timeDiffs);
									if (mP.currentSong.timeDiffs.length >= 15) {
										var avgDiff = Math.floor(average(mP.currentSong.timeDiffs));
										if (avgDiff > 20 || avgDiff < -20) {
											mP.currentSong.lastDiffAdjustment += (avgDiff * 0.7);
											mP.currentSong.setPosition((new Date).getTime() - mP.currentSongEpoch + mP.currentSong.lastDiffAdjustment);
											mP.currentSong.timeDiffs = [];
										}
										console.log("adjusted time" + avgDiff);
									}
									if (mP.currentSong.timeDiffs.length >= 80) {
										mP.currentSong.positionFixed = true;
									}
								}
							}, 200);
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
