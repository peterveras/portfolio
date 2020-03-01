 $(window).on('load', function(){

 /*--------------------------------------------------
   PRELOADER
---------------------------------------------------*/ 
    $('main').waitForImages(function() {
        $('#preloader').delay(100).fadeOut('slow');
    });


   // WOW JS
  new WOW({ mobile: false }).init();


$(document).ready( function() {

    SiteMenu();
    slideShow();
    PortfolioGrids();    
    filtershow();
    showarrow();
    ZoomImage();
    pageface();
    header_effect();
    fixed_buttons();
    lightbox();
    carousel_slider();

    function mobile () {
        if ( $(window).width() >= 769 ){
          HoverVideo();
          hovertrid ();
          DownIcon ();
      }
    }

  mobile ();
$(window).resize(mobile);



//WHEN AJAX LOAD
function ajaxLoad(){
    SiteMenu(); 
    PortfolioGrids(); 
    pageface();
    header_effect();
    fixed_buttons();
    lightbox();
    carousel_slider();

    function mobile () {
        if ( $(window).width() >= 769 ){
          HoverVideo();
          hovertrid ();
          DownIcon ();
      }
    }

    mobile ();
    $(window).resize(mobile);

}


 /*--------------------------------------------------
    AJAX LOAD
---------------------------------------------------*/ 

  $("main").on('click','[data-type="ajax-load"]', function(e) {
      var href = $(this).attr("href");
      loadHtml();
      function loadHtml() {
          setTimeout(function() {
              loadContent(href);            
              history.pushState('', 'new URL: '+href, href);      
              SiteMenu();   
              $('header, .uptotop').midnight();  
          },500);
      }
      e.preventDefault();
  });
  window.onpopstate = function(event) {
      location.reload();
  };
  function loadContent(url) {
      var getData = $.get(url, function(response) {
          var markup = $("<main>" + response + "</main>");
          var fragment = markup.find("main").html();
          var title = markup.find("title").html();
          $('head title').html( title );

          $("main").html(fragment);
          window.scrollTo(0, 0);
          ajaxLoad ();
      });
  }


 /*--------------------------------------------------
    HOME AUTO HEİGHT
---------------------------------------------------*/ 
     function centerInit() {
        var hometext = $('section.home, .home-slider, .hero')
        hometext.css({
            "height": $(window).height() + "px"
        });
    }
    centerInit();
    $(window).resize(centerInit);

});


    
// FADE OUT EFFECT WHEN CLICK A LINK
function pageface(){
  $('body').prepend("<div class='fadeffect'></div>");
  $(document).on("click", "a:not(.grid-item):not(.lightbox)", function () {
      var newUrl = $(this).attr("href");
      $('.fadeffect').addClass('show');
      if (!newUrl || newUrl[0] === "#") {
          location.hash = newUrl;
          return;
      }
      setTimeout(function() {
          location = newUrl;
      }, 500);
      return false;
  });
}


 /*--------------------------------------------------
    HEADER COLOR JS
---------------------------------------------------*/ 
function header_effect() {
   $('header, .uptotop').midnight();
     setTimeout(function() {
        $('.hero, header').addClass('load');           
  },500);
}

  function hasTouch() {
    return 'ontouchstart' in document.documentElement
           || navigator.maxTouchPoints > 0
           || navigator.msMaxTouchPoints > 0;
}

if (hasTouch()) { // remove all :hover stylesheets
    try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}
}


 /*--------------------------------------------------
    MAGNIFIC LIGHTBOX JS
---------------------------------------------------*/ 

function lightbox() {
  $('.lightbox').magnificPopup({
        type:'image',
        gallery:{enabled:true},
        zoom:{enabled: true, duration: 300}
    });
}


 /*--------------------------------------------------
    HOME HELLO TEXT
---------------------------------------------------*/ 
    function slideShow(){
    var current = $('.hi .show');
    var next = current.next().length ? 
      current.next() :
      current.siblings().first();
    current.hide().removeClass('show');
    next.fadeIn("slow").addClass('show');
    setTimeout(slideShow, 1200);  
    };

 /*--------------------------------------------------
    DOWN ICON
---------------------------------------------------*/ 

function DownIcon () {
    $('.down-icon').mouseleave(function(e){
             TweenMax.to(this, 0.3, {scale: 1});
             TweenMax.to('.icon-circle, .icon', 0.3,{scale:1, x: 0, y: 0});              
        });
        
        $('.down-icon').mouseenter(function(e){
             TweenMax.to(this, 0.3, {transformOrigin: '0 0', scale: 1});
             TweenMax.to('.icon-circle', 0.3,{scale: 1.2});
        });
        
        $('.down-icon').mousemove(function(e){   
          move(e);
        });
        
        function move(e){
          tada(e, '.icon-circle', 60);
          tada(e, '.icon', 40);
        }
        
       function tada(e, target, movement){
        var $this = $('.down-icon');
        var bouncing = $this[0].getBoundingClientRect();
        var relX = e.pageX - bouncing.left;
        var relY = e.pageY - bouncing.top;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
        TweenMax.to(target, 0.3, {
          x: (relX - bouncing.width/2) / bouncing.width * movement,
          y: (relY - bouncing.height/2 - scrollTop) / bouncing.width * movement,
          ease: Power2.easeOut
        });
    }
}

 /*--------------------------------------------------
    PORTFOLIO EFFECT & LOAD JS
---------------------------------------------------*/ 

  function hovertrid () {
      $(".grid-item").hover3d({
          selector: "figure",
          perspective: 3000,
          shine: false
      });
  }

  function PortfolioGrids() {
  var $container = $('.masonry');
  $container.imagesLoaded( function() {   
      $container.isotope({
        itemSelector: '.grid-item, .lightbox-gallery .image',
        gutter:0,
        transitionDuration: "0.5s",
        columnWidth: '.grid-item'
      });
  })
      $('.portfolio_filter ul li a').on("click", function(){
        $(".portfolio_filter ul li a").removeClass("select-cat");
        $(this).addClass("select-cat");        
        var selector = $(this).attr('data-filter');
        $(".masonry").isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false,
      }
    });
        return false;
    });   
    
    $(".filter-icon").on("click", function() {
            $('.portfolio_filter').addClass('show');        
    });

    $(".portfolio_filter").on("click", function (event) {
    if (!$(event.target).is(".portfolio_filter ul li a")) {
            $('.portfolio_filter').removeClass('show');
            return false;
        }
    });   

    // Infinite Scroll
    var curPage = 1;
    var pagesNum = $("#pagination-selector").find("li a:last").text();   // Number of pages

    $container.infinitescroll({
        itemSelector: '.grid-item',
        nextSelector: '.portfolio-pagination li a',
        navSelector: '#pagination-selector',
        extraScrollPx: 0,
        bufferPx: 0,
        maxPage: 6,
        loading: {
            finishedMsg: "No more works",
            msgText: '<div class="loader"><span></span></div>',
            speed: 'slow',
            selector: '.load-more',
        },
    },
    // trigger Masonry as a callback
    function( newElements ) {

          var $newElems = $( newElements );
          $newElems.imagesLoaded(function(){  // Append masonry        
            $newElems.animate({ opacity: 1 });
            $container.isotope( 'appended', $newElems, true ); 
          });
          // Check last page
          curPage++;
          if(curPage == pagesNum) {
            $( '.load-more button' ).remove();
          }
          $('.load-more').find('button').css('visibility', 'visible');
        });

        $container.infinitescroll( 'unbind' );
        // jQuery
    $container.on( 'append.infinitescroll', function( event, response, path, items ) {
      console.log( 'Loaded: ' + path );
    });


        $( '.load-more button' ).on('click', function() {
          setTimeout(function()
           {
            hovertrid ();    
            ZoomImage();  
            },1000);      
          $container.infinitescroll( 'retrieve' );
          $('.load-more').find('button').css('visibility', 'hidden');
          return false;
        });

    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload(); 
        }
    });
  }

 /*--------------------------------------------------
    FULL MENU JS
---------------------------------------------------*/  

function SiteMenu(){
    var $doc = $(document), win = $(window), AnimationsArray = [];
    window.SITE = {
        init: function() {
         var menu2 = $("#full-menu.fullmenu"), 
                 items2 = menu2.find(".navmenu>li"), 
                 toggle = $(".menu"), 
                 nav_menus = (toggle.find("span"), 
        new TimelineLite({
            paused: !0,
            onStart: function() {
                menu2.css("display", "table");
            },
            onReverseComplete: function() {
            }

        })), close = $("#full-menu"), links = menu2.find("li.scroll > a");            
        AnimationsArray.push(nav_menus), nav_menus.add(TweenLite.to(menu2, .5, {
                autoAlpha: 1,
                ease: Quart.easeOut
            })).staggerFrom(items2, .1 * items2.length, {
                y: "50",
                opacity: 0,
                ease: Quart.easeOut
            }, .1), toggle.on("click", function() {
                return toggle.data("toggled") ? (nav_menus.timeScale(1.6).reverse(), 
                toggle.data("toggled", !1)) : (nav_menus.timeScale(1).restart(), 
                toggle.data("toggled", !0)), !1;
            }),close.on("click", function (event) {
                  if (!$(event.target).is("li.scroll > a")) {
                    return nav_menus.timeScale(1.6).reverse(), 
                    toggle.data("toggled", !1), !1;
                  }
                }), links.on("click", function() {
                var _this = $(this), url = _this.attr("href"), hash = -1 !== url.indexOf("#") ? url.substring(url.indexOf("#") + 1) : "", pos = $("#" + hash).offset().top - $(".header").outerHeight() 
                return hash ? (nav_menus.timeScale(2).reverse(), 
                toggle.data("toggled", !1), TweenMax.to(window, win.height() / 500, {
                    scrollTo: {
                        y: pos
                    },
                    ease: Quart.easeOut
                }), !1) : !0;
            });
    }
    }, $doc.ready(function() {
        window.SITE.init();   
        $(".navmenu li a").on('click', function(){
        $('html, body').animate({scrollTop: $(this.hash).offset().top + 1}, 1000);
      return false;
    });
    });
  } 



 /*--------------------------------------------------
    FIXED BUTTONS SETTINGS
---------------------------------------------------*/ 

function fixed_buttons() { 
    var vheight = $(window).height();
    $('.uptotop .holder').on('click', function() {
      $('html, body').animate({scrollTop : 0},800);
      return false;
    });
    $('.down-icon').on('click', function() {
      $('html, body').animate({scrollTop :vheight},800);
      return false;
    });
 }
      
    function filtershow() {
    if ($('.filter-icon').length) {
        var $window = $(window);
        var vheight = $window.height();
        var window_bottom_position = $window.scrollTop() + vheight;
        var window_top_position = $window.scrollTop();
        var portfolio_position = $('.portfolio').offset().top;
        var portfolio_height = $('.portfolio').height();
        var section_pad = vheight / 5;
        if(window_bottom_position >= portfolio_position + 200){
            $('.filter-icon').addClass('come');
        }else{
            $('.filter-icon').removeClass('come');
        }
        if(window_bottom_position >= portfolio_position + portfolio_height + section_pad + 20 ){
            $('.filter-icon').removeClass('come');         
        }
      }
    }

    function showarrow(){ 
      if ($('.uptotop').length) {
      var $window = $(window);
      var vheight = $window.height();
      var window_bottom_position = $window.scrollTop() + vheight;
      if (window_bottom_position >= vheight + 500 ) {                       
          $(".uptotop").addClass('show');
          } else {
          $(".uptotop").removeClass('show');
        }
       }
    }
    $(window).on('scroll resize', function() {   
        filtershow();
        showarrow();
   }); 


 function ZoomImage() {     
      
  $("body").find(".page-container").each(function() {
      $("#clone-image").append($(this))
    });

    console.clear();
    
    var root  = document.documentElement;
    var body  = document.body;
    var pages = document.querySelectorAll(".page");
    var tiles = document.querySelectorAll(".portfolio-item");
    
    for (var i = 0; i < tiles.length; i++) {  
      addListeners(tiles[i], pages[i]);
    }
    
    function addListeners(tile, page) {
      
      tile.addEventListener("click", function() { 
      $(this).parent().addClass('above');
      setTimeout( function(){
        TweenMax.to('.portfolio-item', 0.3,{opacity: 0, delay: 0.2, ease:Power2.easeInOut});
        TweenMax.to('header', 0.3,{opacity: 0, delay: 0.2, ease:Power2.easeInOut});
        $('.portfolio-item').addClass('zom');
      } , 0 ); 
      
      setTimeout( function(){       
        animotion(tile, page);
      } , 50 ); 
      });
      
      page.addEventListener("click", function() {
      animotion(page, tile);
      });  
    }
    
    function animotion(fromthere, tothere) {
      
      var clone = fromthere.cloneNode(true);        
      var from = calculate(fromthere);
      var to = calculate(tothere);      
      TweenLite.set([fromthere, tothere], { visibility: "hidden" });
      TweenLite.set(clone, { position: "absolute", margin: 0 });
      
      body.appendChild(clone);  
        
      var style = {
      x: to.left - from.left,
      y: to.top - from.top,
      width: to.width,
      height: to.height,
      autoRound: false,
      ease: Power2.easeInOut,
      onComplete: onComplete
      };
       
      TweenLite.set(clone, from);  
      TweenLite.to(clone, 0.6, style)
      
      function onComplete() {
      TweenLite.set(tothere, { visibility: "visible" });
      body.removeChild(clone);
      }

    }
    
    function calculate(element) {
      
      var rect = element.getBoundingClientRect();
      
      var scrollTop  = window.pageYOffset || root.scrollTop  || body.scrollTop  || 0;
      var scrollLeft = window.pageXOffset || root.scrollLeft || body.scrollLeft || 0;
      
      var clientTop  = root.clientTop  || body.clientTop  || 0;
      var clientLeft = root.clientLeft || body.clientLeft || 0;
      
      return {
      top: Math.round(rect.top + scrollTop - clientTop),
      left: Math.round(rect.left + scrollLeft - clientLeft),
      height: rect.height,
      width: rect.width,
      };
    }
    
  }


 /*--------------------------------------------------
    OWL CAROUSEL JS
---------------------------------------------------*/    

function carousel_slider() {  
    var owlcar = $('.owl-carousel');
    if (owlcar.length) {
        owlcar.each(function () {
            var $owl = $(this);
            var itemsData = $owl.data('items');
            var autoplayData = $owl.data('autoplay');
            var autoPlayTimeoutData = $owl.data('autoplaytimeout');
            var dotsData = $owl.data('dots');
            var navData = $owl.data('nav');
            var marginData = $owl.data('margin');
            var stagePaddingData = $owl.data('stagepadding');
            var itemsDesktopData = $owl.data('items-desktop');
            var itemsTabletData = $owl.data('items-tablet');
            var itemsTabletSmallData = $owl.data('items-tablet-small');
            $owl.owlCarousel({
                  items: itemsData
                , dots: dotsData
                , nav: navData
                , margin: marginData
                , loop: true
                , stagePadding: stagePaddingData
                , autoplay: autoplayData
                , autoplayTimeout: autoPlayTimeoutData
                , navText: ["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"]
                , responsive:{
                        0:{
                            items:itemsTabletSmallData,
                            stagePadding:0
                        },
                        600:{
                            items:itemsTabletData,
                            stagePadding:0
                        },
                        1000:{
                            items:itemsDesktopData
                        }
                    }
            , });
        });
    }

}


function HoverVideo(){
  var figure = $(".portfolio-item.video").hover( hoverVideo, hideVideo );
  function hoverVideo(e) {  
      $('video', this).get(0).play(); 
  }
  function hideVideo(e) {
      $('video', this).get(0).pause(); 
  }
}




}); // document read end 



