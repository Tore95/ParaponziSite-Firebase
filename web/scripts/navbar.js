// grabbing the class names from the data attributes
var navBar = $('.navbar'),
    data = navBar.data();

var navLogo = $('#nav-logo');
var navButton = $('#nav-button');

var switchState = "close";

// booleans used to tame the scroll event listening a little..
var scrolling = false,
    scrolledPast = false;

// transition Into
function switchInto() {
    // update `scrolledPast` bool
    scrolledPast = true;
    // add/remove CSS classes
    navBar.removeClass(data.startcolor);
    navBar.removeClass(data.startsize);
    navBar.addClass(data.intocolor);
    navBar.addClass(data.intosize);
    navLogo.addClass('scrolled-logo');
    navLogo.removeClass('unscrolled-logo');
}

// transition Start
function switchStart() {
    // update `scrolledPast` bool
    scrolledPast = false;
    // add/remove CSS classes
    navBar.addClass(data.startcolor);
    navBar.addClass(data.startsize);
    navLogo.addClass('unscrolled-logo');
    navLogo.removeClass('scrolled-logo');
    navBar.removeClass(data.intocolor);
    navBar.removeClass(data.intosize);
}

navButton.click(function () {
    if (navButton.attr('aria-expanded') === "false") {
        switchInto();
    } else {
        if (switchState === "close") {
            switchStart();
        }
    }
});

// set `scrolling` to true when user scrolls
$(window).scroll(function () {return scrolling = true;});

setInterval(function () {
    // when `scrolling` becomes true...
    if (scrolling) {
        // set it back to false
        scrolling = false;
        // check scroll position
        if ($(window).scrollTop() > 100) {
            // user has scrolled > 100px from top since last check
            switchState = "open";
            if (!scrolledPast && navButton.attr('aria-expanded') === "false") {
                switchInto();
            }
        } else {
            // user has scrolled back <= 100px from top since last check
            switchState = "close";
            if (scrolledPast && navButton.attr('aria-expanded') === "false") {
                switchStart();
            }
        }
    }
    // take a breath.. hold event listener from firing for 100ms
}, 100);

/*
$(document).ready(function(){

    $('.navbar .navbar-nav li a, .down_arrow .scroll_down').on('click', function(e){
        console.log("primo");
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top - 50
        }, 1500);
        e.preventDefault();
    });
    $(document).on('click','.navbar-collapse.in',function(e) {
        console.log("secondo");
        if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
            $(this).collapse('hide');
        }
    });
    $('.navbar .navbar-nav li a').on('click', function(){
        console.log("terzo");
        $('.navbar-collapse').collapse('hide');
    });

});
 */
