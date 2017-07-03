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

  // searches for specific queryString, returns value or true if empty value
  function getQueryStringByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return true;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  // making large one word title scale to viewport
  // $('.banner-title--lg').fitText();


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage = $('body').data('current-page');

  // add class to individual nav item
  $('.page--' + currentPage + ' [class*=nav__item--' + currentPage + ']').addClass('is-current');


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
//      Expand Interview
///////////////////////////////////////

// Hide all interview content
$('.js-interview').hide();

// toggle the intreview open or close
$('.js-expand-interview-toggle').on('click',function(e){
  e.preventDefault();
  // finds closest interview
  var parent = $(this).closest('.interview'),
      interview = $('.js-interview',parent);
  // shows and hides interview
  interview.stop().slideToggle(600);
  // Toggles between the text content
  if ($(this).text() === 'Interview Lesen') {
    $(this).text('Verstecke interview');
    // scrolls down to open interview
    $('html,body').animate({
      scrollTop: interview.offset().top
    }, 500);
  } else {
    $(this).text('Interview Lesen');
  }
});

// open interview on page load with query string
if (getQueryStringByName('interview')) {
  // shows interview
  $('#julia-thell .js-interview').stop().show();
  // changes button text to close interview
  $('#julia-thell .js-expand-interview-toggle').text('Verstecke interview');
}


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
      $(this).html(event.strftime('Endet <strong>heute</strong>'));
    } else {
      // there are days left, outputs with either day or days
      $(this).html(event.strftime('Verbleibende Zeit: <strong>%-D %!D:Tag,Tage;</strong>'));
    }
  });
});


  ///////////////////////////////////////
  //    Youtube Modal
  ///////////////////////////////////////

    var youtubeModal           = $('.js-youtube-modal'),
        youtubeModalLaunchBtn  = $('.js-open-youtube-modal'),
        youtubeModalCloseBtn   = $('.js-close-youtube-modal');

      // opens modal with specific content
      function youtubeModalOpen(event){
        event.preventDefault();

        // get youtube id and target div
        var video     = $('.js-video-insert'),
            youtubeId = video.data('youtube-id');

        // insert youtube video with extra options
        video.html('<iframe class="video__iframe" src="https://www.youtube.com/embed/'+ youtubeId +'?rel=0&amp;showinfo=0&autoplay=1" frameborder="0"></iframe>');

        // disable scrolling on background content (doesn't work iOS)
        $('body').addClass('disable-scroll');
        // open modal
        youtubeModal.fadeIn('250', function(){
          $(this).removeClass('is-closed').addClass('is-open');
        });

      }

      // closes modal and hides all content
      function youtubeModalClose(event){
        event.preventDefault();
        // enable scrolling
        $('body').removeClass('disable-scroll');
        // close modal with fade
        youtubeModal.fadeOut('250', function(){
          $(this).removeClass('is-open').addClass('is-closed');
          // Remove status class from modal content
          $('.modal__content.is-open').removeClass('is-open');
          // stop the youtube video from playing
          $('.js-video-insert').empty();
        });


      }

      // launches modal when offer is clicked
      youtubeModalLaunchBtn.on('click', function(event) {
        youtubeModalOpen(event);
      });

      // closes modal on close icon click
      youtubeModalCloseBtn.on('click', function(event) {
        youtubeModalClose(event);
      });

      // closes modal on background click
      youtubeModal.on('click', function(event) {
        if (event.target !== this){
          return;
        }
        youtubeModalClose(event);
      });

      // closes modal on escape key press
      $(document).keyup(function(event) {
         if (event.keyCode == 27) {
           youtubeModalClose(event);
          }
      });


///////////////////////////////////////
//    modal POIS
///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal');

    // opens modal with specific content
    function modalOpen(event){
      event.preventDefault();
      // hides all modal content
      $('.modal__content').hide();
      // show specific modal content from element data attribute
      var modalContent   = $(event.currentTarget).data('modal-id'),
          modalContentId = '.modal__content--' + modalContent;
      $(modalContentId).show().addClass('is-open');
      // disable scrolling on background content (doesn't work iOS)
      $('body').addClass('disable-scroll');
      // open modal
      modal.fadeIn('250', function(){
        $(this).removeClass('is-closed').addClass('is-open');
      });
    }

    // closes modal and hides all content
    function modalClose(event){
      event.preventDefault();
      // enable scrolling
      $('body').removeClass('disable-scroll');
      // reset scroll position
      // This is a bit hacky, but visually hides the scroll position resetting
      setTimeout(function() {
        $('.modal__content-wrap').scrollTop(0);
      }, 280);
      // close modal with fade
      modal.fadeOut('250', function(){
        $(this).removeClass('is-open').addClass('is-closed');
        // Remove status class from modal content
        $('.modal__content.is-open').removeClass('is-open');
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
  //    Modal Nav - next & previous
  ///////////////////////////////////////

    $('.js-modal-nav').on('click', function(event) {
      event.preventDefault();

      var navDirection  = $(this).data('nav-direction'),
          currentModal  = $('.modal__content.is-open'),
          nextModal     = currentModal.next('.modal__content'),
          previousModal = currentModal.prev('.modal__content'),
          firstModal    = $('.modal__content:first'),
          lastModal     = $('.modal__content:last');


      function launchNextModal(){
        // hides the current modal
        currentModal.hide().removeClass('is-open');
        // reset scroll position
        $('.modal__content-wrap').scrollTop(0);
        if (nextModal.length !== 0) {
          // shows next
          nextModal.show().addClass('is-open');
        } else {
          // isn't another modal so goes back to beginning
          firstModal.show().addClass('is-open');
        }
      }

      function launchPreviousModal(){
        // hides the current modal
        currentModal.hide().removeClass('is-open');
        // reset scroll position
        $('.modal__content-wrap').scrollTop(0);
        if (previousModal.length !== 0) {
          // shows previous
          previousModal.show().addClass('is-open');
        } else {
          // isn't another modal so goes back to the end
          lastModal.show().addClass('is-open');
        }
      }

      // checks which button has been clicked and runs function
      switch (navDirection) {
        case 'next':
          launchNextModal();
          break;
        case 'previous':
          launchPreviousModal();
          break;
      }

    });



///////////////////////////////////////
//        Random Title color
///////////////////////////////////////
// goes through every ".title" on the page and assigns a class to change the color

var classNames = ['title--blue','title--yellow','title--green'];
var classCounter = 0;

$('.title--color').each(function(i) {
  if (classCounter > (classNames.length - 1)) {
    classCounter = 0;
  }
  $(this).addClass(classNames[classCounter]);
  classCounter++;
});



///////////////////////////////////////
//        Random Button color
///////////////////////////////////////
// goes through every ".title" on the page and assigns a class to change the color

var buttonClassNames = ['btn--blue','btn--yellow','btn--green'];
var buttonClassCounter = 0;

$('.btn--color').each(function(i) {
  if (buttonClassCounter > (buttonClassNames.length - 1)) {
    buttonClassCounter = 0;
  }
  $(this).addClass(buttonClassNames[buttonClassCounter]);
  buttonClassCounter++;
});


///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end