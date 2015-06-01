describe('test musicplayer initialization', function() {

	var scope, ctrl;

	beforeEach(function() {
		module('musicplayer');
		inject(function($controller) {
			scope = {}, ctrl = $controller('MusicPlayer', {$scope:scope});
		});
	});

	it('Test should pass', function() {
		expect(null).toBeNull();
	});

	it('volume should be 50 at the start', function() {
		expect(ctrl.volume).toBe(50);
	});

	it('currentSongEpoch is -1', function() {
		expect(ctrl.currentSongEpoch).toBe(-1);
	});

	it('currentSong is null', function() {
		expect(ctrl.currentSong).toBeNull();
	});

	it('currentTrackTime is zero', function() {
		expect(ctrl.currentTrackTime).toBe(0);
	});

	it('trackTimeUpdater is null', function() {
		expect(ctrl.trackTimeUpdater).toBeNull();
	});

});

describe('test musicplayer millisToMinutesAndSeconds', function() {

	var scope, ctrl;

	beforeEach(function() {
		module('musicplayer');
		inject(function($controller) {
			scope = {}, ctrl = $controller('MusicPlayer', {$scope:scope});
		});
	});

	it('millisToMinutesAndSeconds should be 0:00 if no song is loaded', function() {
		expect(ctrl.millisToMinutesAndSeconds(0)).toBe("0:00");
		expect(ctrl.millisToMinutesAndSeconds(1050)).toBe("0:00");
	});

	it('millisToMinutesAndSeconds should include zero in tens digit if second is a single digit', function() {
		ctrl.currentSong = {};
		expect(ctrl.millisToMinutesAndSeconds(0)).toBe("0:00");
		expect(ctrl.millisToMinutesAndSeconds(1000)).toBe("0:01");
	});

	it('millisToMinutesAndSeconds should round down seconds', function() {
		ctrl.currentSong = {};
		expect(ctrl.millisToMinutesAndSeconds(1001)).toBe("0:01");
		expect(ctrl.millisToMinutesAndSeconds(1999)).toBe("0:01");
	});

	it('millisToMinutesAndSeconds should display minutes', function() {
		ctrl.currentSong = {};
		expect(ctrl.millisToMinutesAndSeconds(60000)).toBe("1:00");
	});

	it('millisToMinutesAndSeconds should display hours', function() {
		ctrl.currentSong = {};
		expect(ctrl.millisToMinutesAndSeconds(3600000)).toBe("1:00:00");
	});

});
