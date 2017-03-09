(function ($, root, undefined) {$(function () {'use strict'; // on ready start
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
//        general
///////////////////////////////////////

  // css tricks snippet - http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  // inserts current year
  $('.js-year').html(new Date().getFullYear());

  // detects touch device
  if ("ontouchstart" in document.documentElement){
    $('html').addClass('touch');
  }


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage = $('body').data('current-page');
  $('.' + currentPage + ' .site-nav__item--' + currentPage).addClass('site-nav__item--current');


///////////////////////////////////////
//      SVG image swap
///////////////////////////////////////

  // finds image with class and swaps .png with .svg in img source string
  if (Modernizr.svgasimg) {
    var svgSwap = $('img.js-svg-swap');
    svgSwap.each( function() {
      var currentSrc = $(this).attr('src'),
          newSrc = currentSrc.replace('.png', '.svg');
      $(this).attr('src', newSrc);
    });
  }


///////////////////////////////////////
//    Generic modal
///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal');

    // opens modal
    function modalOpen(event){
      event.preventDefault();
      // disable scrolling on background content (doesn't work iOS)
      $('body').addClass('disable-scroll');
      // // open modal
      modal.fadeIn('250', function(){
        $(this).removeClass('is-closed').addClass('is-open');
      });
    }

    // closes modal
    function modalClose(event){
      event.preventDefault();
      // enable scrolling
      $('body').removeClass('disable-scroll');
      // close modal with fade
      modal.fadeOut('250', function(){
        $(this).removeClass('is-open').addClass('is-closed');
      });
    }

    // launches modal when offer is clicked
    modalLaunchBtn.on('click', function(event) {
      modalOpen(event);
    });

    // closes modal on close icon click
    modalCloseBtn.on('click', function(event) {
      modalClose(event);
    });

    // closes modal on background click
    modal.on('click', function(event) {
      if (event.target !== this){
        return;
      }
      modalClose(event);
    });

    // closes modal on escape key press
    $(document).keyup(function(event) {
       if (event.keyCode == 27) {
         modalClose(event);
        }
    });


///////////////////////////////////////
//  Home Image slider - extra fucntions
///////////////////////////////////////

var homeCarousel      = $('.owl-carousel'),
    carouselContainer = $('.slider, .slider__content'),
    carouselLink      = $('.js-slider-link'),
    carouselLocation  = $('.js-slider-location'),
    activeSlide       = $('.owl-item.active > .slider__content'),
    transitionSpeed   = 1250,
    hiddenElements    = '.slider__info, .owl-nav, .owl-dots';

homeCarousel.owlCarousel({
  items:1,
  loop:true,
  autoHeight:true,
  nav: true,
  navSpeed: transitionSpeed,
  smartSpeed: transitionSpeed,
  dragEndSpeed: transitionSpeed,
  callbacks:true,
});

// Hide all of the slider chrome on page load
$(hiddenElements).hide();

// This grabs the slide information from the data attributes to update the link
// and location name for each slide.
function sliderContentRefresh(){
  var currentLink     = $('.owl-item.active > .slider__content').data('link'),
      currentLocation = $('.owl-item.active > .slider__content').data('location');
  carouselLink.attr('href', currentLink);
  carouselLocation.text(currentLocation);
}

// the callbacks for the owlCarousel plugin are a bit crap and dont fire after
// the animation. Also if you do two drags in a row, it is very easy to break.
// This interval fires every half second to check the active class. I know its
// gross, but its the most reliable way to write this code. And its a small
// amount of processing every half second. Will need to test, but hopefully most
// browsers will handle it
setInterval(function() {
  if ($('.owl-item').hasClass('active')) {
    sliderContentRefresh();
  }
}, 500);

// Lauch slider button function
$('.js-launch-slider').on('click', function(event) {
  event.preventDefault();
  // makes the slider a bit larger, hides the nav
  carouselContainer.css('transition', ('all ' + ((transitionSpeed/1000)/2) + 's ease')).css('height', '100%');
  // hide the overlay and bring in the controls
  $('.js-fade-out').fadeOut(transitionSpeed);
  $(hiddenElements).fadeIn(transitionSpeed);
  // starts to automatically cycle through slides
  // owlCarousel autoplay start stop events dont work. This is an alternate way
  // to make it auto advance and then stop when the user interacts with it
  var fauxAutoplay = setInterval(function() {
    homeCarousel.trigger('next.owl.carousel');
  }, (transitionSpeed*2.5));
  homeCarousel.on('click',function() {
    clearInterval(fauxAutoplay);
  });

  // keyboard nav for the active carousel
  $(document.documentElement).keyup(function (event) {
    if (event.keyCode == 37) {  // left key press
      homeCarousel.trigger('prev.owl.carousel');
      clearInterval(fauxAutoplay);
    } else if (event.keyCode == 39) {  // right key press
      homeCarousel.trigger('next.owl.carousel');
      clearInterval(fauxAutoplay);
    }
  });

  // stop carousel autoplaying, if dragged
  homeCarousel.on('dragged.owl.carousel', function(event) {
    clearInterval(fauxAutoplay);
  });
});


///////////////////////////////////////
//           Image slider
///////////////////////////////////////

var backgrounds    = $('.js-fading-backgrounds .js-fading-background'),
    counter        = 0,
    slideTime      = 3000,
    transitionTime = slideTime / 2;

// hide all but first
$(backgrounds).hide();
$(backgrounds[0]).show();

setInterval(function() {
  $(backgrounds[counter]).fadeOut(transitionTime);
  counter++;
  if (counter === backgrounds.length) {
    counter = 0;
  }
  $(backgrounds[counter]).fadeIn(transitionTime);
}, slideTime);


///////////////////////////////////////
//      Expand Interview
///////////////////////////////////////

$('.js-interview').hide();
$('.js-expand-interview-toggle').on('click',function(e){
  e.preventDefault();
  // finds closest interview
  var parent = $(this).closest('.interview'),
      interview = $('.js-interview',parent);

  // shows and hides interview
  interview.stop().slideToggle(600);

  // Toggles between the text content
  if ($(this).text() === 'Read Interview') {
    $(this).text('Hide Interview');
  } else {
    $(this).text('Read Interview');
  }
});


///////////////////////////////////////
//       Offer expiry countdown
///////////////////////////////////////

// loops through each offer on page and sets the current days remaining
$('.js-offer-expires').each(function() {
  // gets the expires date from the object
  var expires = $(this).data('expires');
  $(this).countdown(expires, function(event) {
    if (event.elapsed) {
      // the expired date is in the past so the expired message is removed
      $(this).remove();
    } else if (event.offset.totalDays === 0) {
      // there is 0 days left, just hours, so ends today
      $(this).html(event.strftime('Ending <strong>Today</strong>'));
    } else {
      // there are days left, outputs with either day or days
      $(this).html(event.strftime('Ending in <strong>%-D day%!D</strong>'));
    }
  });
});



///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end