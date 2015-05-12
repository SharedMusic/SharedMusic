var musicPlayer = angular.module('musicplayer', []);

musicPlayer.controller('MusicPlayer', ['$scope', function($scope){
	var mP = this;
	mP.currentSongEpoch = null;
	mP.currentSongURL = null;
	mP.test = "YUP"

	SC.initialize({
	  client_id: '337bccb696d7b8442deedde76fae5c10'
	});

	//mP.updateSong = function(songURL, epoch){
		//mP.currentSongURL = songURL;
		//mP.currentSongEpoch = epoch;
	mP.updateSong = function() {

		// fetch track information 
		//SC.get("/resolve/?url="+mP.currentSongURL, {limit: 1}, function(result){
		SC.get("/resolve/?url=https://soundcloud.com/highonmusic1/ed-sheeran-im-in-love-with-the-coco-hitimpulse-remix", {limit: 1}, function(result){
			mP.trackInfo = result
		});

		// SC.stream(trackPath, [options], [callback])
		SC.stream("/tracks/"+mP.trackInfo.id, function(sound){
		  sound.play();
		});
	};
}]);
