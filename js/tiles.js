$( document ).ready(function() {
    $('body').on('mouseenter', 'div.tileImage', function() {
    	$(this).children(".trackInfoContainer").animate({top: -105});
	});

    $('body').on('mouseleave', 'div.tileImage', function() {
    	$(this).children(".trackInfoContainer").animate({top: 0});
	});

    $('body').on('mouseenter', 'img.imageLeft', function() {
    	$(this).attr('src', "/images/addsong_dark.png");
	});

	$('body').on('mouseleave', 'img.imageLeft', function() {
    	$(this).attr('src', "/images/addsong.png");
	});

	$('body').on('mouseenter', 'img.imageRight', function() {
    	$(this).attr('src', "/images/soundcloud_dark.png");
	});

	$('body').on('mouseleave', 'img.imageRight', function() {
    	$(this).attr('src', "/images/soundcloud.png");
	});
	
	$('body').on('DOMNodeInserted', '.live-tile', function () {
		var randomInitDelay = Math.random() * (3000);

		$(this).liveTile({ 
			pauseOnHover: true,
            delay: 3000,
            speed: 1000, 
            initDelay: randomInitDelay
        })
	});
});