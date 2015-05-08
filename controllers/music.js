var musicList = angular.module('music', []);

// Need to remove this as soon as we figure out how to get the roomstate in as a dependency
musicList.service('roomstate', function(){
	var rs = this;
	this.users = [];
	this.queue = [];
	// this.test = new Set();
});

musicList.controller('MusicController', ['$scope', 'roomstate', function($scope, roomstate){
	var mL = this;
	mL.queue = roomstate.queue;

	// Adds a song to the queue
	mL.addSong = function(){
		// This currently just pushes to an array in the roomstate, this will need to make a request to the server
		mL.queue.push({name:mL.temp, id:mL.queue.length})
	};
}]);
