describe('musicplayer', function() {

	// Global
	/*
	it('volume at the start should be 50', function() {
		var scope = {},
		mp = new MusicPlayer(scope);

		expect(mp.volume).toBe(50);
	});
	*/

	// non Global controller
	beforeEach(module('musicplayer'));

	it('volume should be 50 at the start', inject(function($controller) {
		var scope = {},
			ctrl = $controller('MusicPlayer', {$scope:scope});

		expect(ctrl.volume).toBe(50);
	}));


});
