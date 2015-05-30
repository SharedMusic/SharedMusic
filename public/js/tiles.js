$( document ).ready(function() {
	$('body').on('DOMNodeInserted', '.live-tile', function () {
		var randomInitDelay = Math.random() * (50000);
		$(this).liveTile({ 
			pauseOnHover: true,
            delay: 50000,
            speed: 1000,
            initDelay: randomInitDelay
        })
	});
});