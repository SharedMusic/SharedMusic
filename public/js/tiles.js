$( document ).ready(function() {
    $('body').on('mouseenter', '.live-tile', function() {
    	$(this).find(".addIcon").fadeIn(500);
	});

    $('body').on('mouseleave', '.live-tile', function() {
    	$(this).find(".addIcon").fadeOut(500);
	});

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