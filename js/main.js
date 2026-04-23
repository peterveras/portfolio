$(document).ready(function () {
  var ajaxManagedStyleAttr = "data-ajax-page-style";
  var burgerKingLottieSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
  var globalStyles = {};
  var scrollRevealObserver = null;

  [
    "https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.6/css/swiper.min.css",
    "/css/style.css",
    "/icon-fonts/fontawesome-5.0.6/css/fontawesome-all.min.css",
    "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700",
  ].forEach(function (href) {
    globalStyles[normalizeUrl(href)] = true;
  });
  primeManagedStyles();

  /*--------------------------------------------------
   PRELOADER HIDE LOGIC
---------------------------------------------------*/
  var preloaderHidden = false;
  function hidePreloader() {
    if (!preloaderHidden) {
      $("#preloader").delay(100).fadeOut("slow");
      preloaderHidden = true;
    }
  }

  // Hide when images are ready
  $("main").waitForImages(hidePreloader);

  // Fail-safe: Force hide after 3 seconds if assets are hanging
  setTimeout(hidePreloader, 3000);

  // Site Initialization
  initializePage();

  function initializePage() {
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
    runResponsiveEnhancements();
    runPageSpecificInitializers();
  }

  function ajaxLoad() {
    SiteMenu();
    PortfolioGrids();
    pageface();
    header_effect();
    fixed_buttons();
    lightbox();
    carousel_slider();
    runResponsiveEnhancements();
    runPageSpecificInitializers();
  }

  function runResponsiveEnhancements() {
    if ($(window).width() >= 769) {
      HoverVideo();
      hovertrid();
      DownIcon();
    }
  }

  $(window)
    .off("resize.mobileEnhancements")
    .on("resize.mobileEnhancements", runResponsiveEnhancements);

  /*--------------------------------------------------
    AJAX LOAD
---------------------------------------------------*/

  $("main").on("click", '[data-type="ajax-load"]', function (e) {
    var href = $(this).attr("href");
    e.preventDefault();

    setTimeout(function () {
      loadContent(href, true);
      $("header, .uptotop").midnight();
    }, 500);
  });

  window.onpopstate = function () {
    loadContent(window.location.pathname + window.location.search, false);
  };

  function loadContent(url, shouldPushState) {
    $.get(url, function (response) {
      var parser = new DOMParser();
      var responseDocument = parser.parseFromString(response, "text/html");
      var fragment = $(responseDocument).find("main").html();
      var title = $(responseDocument).find("title").first().text();

      if (!fragment) {
        window.location = url;
        return;
      }

      syncPageStyles(responseDocument);

      if (title) {
        $("head title").text(title);
      }

      $("main").html(fragment);

      if (shouldPushState) {
        history.pushState("", "new URL: " + url, url);
      }

      window.scrollTo(0, 0);
      ajaxLoad();
    });
  }

  function normalizeUrl(url) {
    if (!url) {
      return "";
    }

    var link = document.createElement("a");
    link.href = url;
    return link.href;
  }

  function syncPageStyles(responseDocument) {
    var requiredStyles = {};

    $(responseDocument)
      .find('head link[rel="stylesheet"][href]')
      .each(function () {
        var href = $(this).attr("href");
        var normalizedHref = normalizeUrl(href);

        if (!normalizedHref || globalStyles[normalizedHref]) {
          return;
        }

        requiredStyles[normalizedHref] = href;

        if (
          !$("head link[rel='stylesheet'][href]").filter(function () {
            return normalizeUrl($(this).attr("href")) === normalizedHref;
          }).length
        ) {
          $("<link>", {
            rel: "stylesheet",
            href: href,
          })
            .attr(ajaxManagedStyleAttr, "true")
            .appendTo("head");
        }
      });

    $("head link[" + ajaxManagedStyleAttr + "]").each(function () {
      var currentHref = normalizeUrl($(this).attr("href"));
      if (!requiredStyles[currentHref]) {
        $(this).remove();
      }
    });
  }

  function primeManagedStyles() {
    $("head link[rel='stylesheet'][href]").each(function () {
      var normalizedHref = normalizeUrl($(this).attr("href"));
      if (!normalizedHref || globalStyles[normalizedHref]) {
        return;
      }

      $(this).attr(ajaxManagedStyleAttr, "true");
    });
  }

  function runPageSpecificInitializers() {
    setFooterYears();
    initBurgerKingAnimations();
    initScrollReveal();
  }

  function initScrollReveal() {
    var revealTargets = collectScrollRevealTargets();

    if (!revealTargets.length) {
      if (scrollRevealObserver) {
        scrollRevealObserver.disconnect();
        scrollRevealObserver = null;
      }
      return;
    }

    prepareScrollRevealTargets(revealTargets);

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealTargets.forEach(showScrollRevealTarget);
      if (scrollRevealObserver) {
        scrollRevealObserver.disconnect();
        scrollRevealObserver = null;
      }
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(showScrollRevealTarget);
      return;
    }

    if (scrollRevealObserver) {
      scrollRevealObserver.disconnect();
    }

    scrollRevealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          showScrollRevealTarget(entry.target);
          scrollRevealObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealTargets.forEach(function (target) {
      if (target.classList.contains("scroll-reveal--visible")) {
        return;
      }

      scrollRevealObserver.observe(target);
    });
  }

  function collectScrollRevealTargets() {
    var selectors = [
      ".portfolio-hero-copy",
      ".portfolio-filters-inline",
      ".portfolio-inline-grid .grid-item",
      ".hero .project-hero-header > *",
      "main section > .container",
      "main section > .project-detail",
      ".project-detail .row.lightbox-gallery",
      ".lightbox-gallery.masonry > .image",
      ".next-link",
    ];
    var targets = [];

    selectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      Array.prototype.forEach.call(elements, function (element) {
        if (!shouldScrollRevealElement(element)) {
          return;
        }

        if (targets.indexOf(element) === -1) {
          targets.push(element);
        }
      });
    });

    return targets;
  }

  function shouldScrollRevealElement(element) {
    if (!element || !element.offsetParent && !element.getClientRects().length) {
      return false;
    }

    if (
      element.closest(
        "header, #full-menu, .uptotop, .mfp-wrap, .mfp-bg, .owl-carousel, .burger-king-lottie"
      )
    ) {
      return false;
    }

    return true;
  }

  function prepareScrollRevealTargets(targets) {
    targets.forEach(function (target) {
      target.classList.add("scroll-reveal");
      clearScrollRevealDelayClasses(target);
    });

    applyScrollRevealDelays(".portfolio-inline-grid", ":scope .grid-item");
    applyScrollRevealDelays(".lightbox-gallery.masonry", ":scope > .image");
    applyScrollRevealDelays(".project-hero-header", ":scope > *");
  }

  function applyScrollRevealDelays(containerSelector, childSelector) {
    var containers = document.querySelectorAll(containerSelector);

    Array.prototype.forEach.call(containers, function (container) {
      var children = container.querySelectorAll(childSelector);

      Array.prototype.forEach.call(children, function (child, index) {
        if (!child.classList.contains("scroll-reveal")) {
          return;
        }

        child.classList.add(
          "scroll-reveal--delay-" + ((index % 4) + 1)
        );
      });
    });
  }

  function clearScrollRevealDelayClasses(element) {
    [
      "scroll-reveal--delay-1",
      "scroll-reveal--delay-2",
      "scroll-reveal--delay-3",
      "scroll-reveal--delay-4",
    ].forEach(function (className) {
      element.classList.remove(className);
    });
  }

  function showScrollRevealTarget(element) {
    if (!element) {
      return;
    }

    element.classList.add("scroll-reveal--visible");
  }

  function setFooterYears() {
    var currentYear = new Date().getFullYear();

    ["copyYear", "copyYearMobile"].forEach(function (id) {
      var elements = document.querySelectorAll("#" + id);
      Array.prototype.forEach.call(elements, function (element) {
        element.textContent = currentYear;
      });
    });
  }

  function loadScriptOnce(src, callback) {
    if (typeof callback !== "function") {
      return;
    }

    if (src === burgerKingLottieSrc && typeof window.lottie !== "undefined") {
      callback();
      return;
    }

    var existingScript = $("script[src='" + src + "']").get(0);
    if (existingScript) {
      if (
        existingScript.getAttribute("data-loaded") === "true" ||
        (src === burgerKingLottieSrc && typeof window.lottie !== "undefined")
      ) {
        callback();
      } else {
        existingScript.addEventListener("load", callback, { once: true });
      }
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = function () {
      script.setAttribute("data-loaded", "true");
      callback();
    };
    document.head.appendChild(script);
  }

  function initBurgerKingAnimations() {
    var burgerKingAnimations = getBurgerKingAnimations();
    var activeAnimations = burgerKingAnimations.filter(function (animation) {
      return document.getElementById(animation.id);
    });

    if (!activeAnimations.length) {
      return;
    }

    loadScriptOnce(burgerKingLottieSrc, function () {
      if (!window.lottie) {
        return;
      }

      activeAnimations.forEach(function (animation) {
        var container = document.getElementById(animation.id);
        if (!container || container.getAttribute("data-lottie-initialized") === "true") {
          return;
        }

        var instance = window.lottie.loadAnimation({
          container: container,
          renderer: "svg",
          loop: animation.loop,
          autoplay: true,
          path: animation.path,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });

        if (animation.speed) {
          instance.setSpeed(animation.speed);
        }

        container.setAttribute("data-lottie-initialized", "true");
      });
    });
  }

  function getBurgerKingAnimations() {
    var isSpanishBurgerKing =
      window.location.pathname.indexOf("/html/spanish/Burger-King.html") !== -1;

    return [
      {
        id: "bk-animation-main-en",
        path: "/img/works/Burger-king/BK-Animation-V2.json",
        loop: true,
        speed: 0.45,
      },
      {
        id: "bk-animation-main-en-mobile",
        path: "/img/works/Burger-king/BK-Animation-UI-mobile.json",
        loop: true,
        speed: isSpanishBurgerKing ? 0.6 : 0.45,
      },
      {
        id: "bk-spinner-en",
        path: "/img/works/Burger-king/Corona-Spinner.json",
        loop: true,
        speed: 1,
      },
      {
        id: "bk-splash-en",
        path: "/img/works/Burger-king/Splash-screen.json",
        loop: true,
        speed: 0.7,
      },
    ];
  }

  /*--------------------------------------------------
    HOME AUTO HEİGHT
---------------------------------------------------*/
  function centerInit() {
    var hometext = $("section.home, .home-slider, .hero");
    hometext.css({
      height: $(window).height() + "px",
    });
  }
  centerInit();
  $(window).resize(centerInit);

  // FADE OUT EFFECT WHEN CLICK A LINK
  function pageface() {
    if ($(".fadeffect").length === 0) {
      $("body").prepend("<div class='fadeffect'></div>");
    }
    // Ensure we don't bind the handler multiple times and ignore AJAX links
    $(document).off("click", "a:not(.grid-item):not(.lightbox):not([data-type='ajax-load'])");
    $(document).on("click", "a:not(.grid-item):not(.lightbox):not([data-type='ajax-load'])", function () {
      var newUrl = $(this).attr("href");
      $(".fadeffect").addClass("show");
      if (!newUrl || newUrl[0] === "#") {
        location.hash = newUrl;
        return;
      }
      setTimeout(function () {
        location = newUrl;
      }, 500);
      return false;
    });
  }

  /*--------------------------------------------------
    HEADER COLOR JS
---------------------------------------------------*/
  function header_effect() {
    $("header, .uptotop").midnight();
    setTimeout(function () {
      $(".hero, header").addClass("load");
    }, 500);
  }

  function hasTouch() {
    return (
      "ontouchstart" in document.documentElement ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  if (hasTouch()) {
    // remove all :hover stylesheets
    try {
      // prevent exception on browsers not supporting DOM styleSheets properly
      for (var si in document.styleSheets) {
        var styleSheet = document.styleSheets[si];
        if (!styleSheet.rules) continue;

        for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
          if (!styleSheet.rules[ri].selectorText) continue;

          if (styleSheet.rules[ri].selectorText.match(":hover")) {
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
    $(".lightbox").magnificPopup({
      type: "image",
      gallery: { enabled: true },
      zoom: { enabled: true, duration: 300 },
    });
  }

  /*--------------------------------------------------
    HOME HELLO TEXT
---------------------------------------------------*/
  function slideShow() {
    var current = $(".hi .show");
    var next = current.next().length
      ? current.next()
      : current.siblings().first();
    current.hide().removeClass("show");
    next.fadeIn("slow").addClass("show");
    setTimeout(slideShow, 1200);
  }

  /*--------------------------------------------------
    DOWN ICON
---------------------------------------------------*/

  function DownIcon() {
    $(".down-icon").mouseleave(function (e) {
      TweenMax.to(this, 0.3, { scale: 1 });
      TweenMax.to(".icon-circle, .icon", 0.3, { scale: 1, x: 0, y: 0 });
    });

    $(".down-icon").mouseenter(function (e) {
      TweenMax.to(this, 0.3, { transformOrigin: "0 0", scale: 1 });
      TweenMax.to(".icon-circle", 0.3, { scale: 1.2 });
    });

    $(".down-icon").mousemove(function (e) {
      move(e);
    });

    function move(e) {
      tada(e, ".icon-circle", 60);
      tada(e, ".icon", 40);
    }

    function tada(e, target, movement) {
      var $this = $(".down-icon");
      var bouncing = $this[0].getBoundingClientRect();
      var relX = e.pageX - bouncing.left;
      var relY = e.pageY - bouncing.top;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      TweenMax.to(target, 0.3, {
        x: ((relX - bouncing.width / 2) / bouncing.width) * movement,
        y:
          ((relY - bouncing.height / 2 - scrollTop) / bouncing.width) *
          movement,
        ease: Power2.easeOut,
      });
    }
  }

  /*--------------------------------------------------
    PORTFOLIO EFFECT & LOAD JS
---------------------------------------------------*/

  function hovertrid() {
    $(".grid-item").hover3d({
      selector: "figure",
      perspective: 3000,
      shine: false,
    });
  }

  function PortfolioGrids() {
    var $justifiedGrids = $(".js-filter-grid");
    var $containers = $(".masonry").not(".js-filter-grid");

    function getJustifiedTargetHeight() {
      var width = $(window).width();
      if (width <= 580) {
        return 220;
      }
      if (width <= 992) {
        return 260;
      }
      return 300;
    }

    function getMinimumItemsPerRow() {
      var width = $(window).width();
      if (width <= 580) {
        return 1;
      }
      if (width <= 992) {
        return 2;
      }
      return 3;
    }

    function getGridItemRatio($item) {
      var presetRatio = parseFloat($item.attr("data-ratio"));
      if (presetRatio) {
        return presetRatio;
      }

      var $img = $item.find("img").first();
      if ($img.length && $img[0].naturalWidth && $img[0].naturalHeight) {
        var naturalRatio = $img[0].naturalWidth / $img[0].naturalHeight;
        $item.attr("data-ratio", naturalRatio);
        return naturalRatio;
      }

      return 1.5;
    }

    function layoutJustifiedRow(items, ratioSum, containerWidth, targetHeight, gap, isLastRow) {
      if (!items.length || !ratioSum || !containerWidth) {
        return;
      }

      var availableWidth = containerWidth - gap * Math.max(items.length - 1, 0);
      var rowHeight = isLastRow
        ? Math.min(targetHeight, availableWidth / ratioSum)
        : availableWidth / ratioSum;

      $.each(items, function (_, item) {
        var itemWidth = rowHeight * item.ratio;
        item.$item.css({
          width: itemWidth + "px",
          height: rowHeight + "px",
        });
      });
    }

    function layoutJustifiedGrid($grid) {
      var gap = 10;
      var targetHeight = getJustifiedTargetHeight();
      var minimumItemsPerRow = getMinimumItemsPerRow();
      var containerWidth = $grid.width();
      var $items = $grid.children(".grid-item").filter(":visible");
      var row = [];
      var rowRatio = 0;

      if (!containerWidth || !$items.length) {
        return;
      }

      $items.each(function () {
        var $item = $(this);
        var ratio = getGridItemRatio($item);

        $item.css({
          width: "",
          height: "",
        });

        row.push({ $item: $item, ratio: ratio });
        rowRatio += ratio;

        if (minimumItemsPerRow === 1) {
          layoutJustifiedRow(row, rowRatio, containerWidth, targetHeight, gap, true);
          row = [];
          rowRatio = 0;
          return;
        }

        if (
          row.length >= minimumItemsPerRow &&
          rowRatio * targetHeight + gap * Math.max(row.length - 1, 0) >= containerWidth
        ) {
          layoutJustifiedRow(row, rowRatio, containerWidth, targetHeight, gap, false);
          row = [];
          rowRatio = 0;
        }
      });

      if (row.length) {
        layoutJustifiedRow(row, rowRatio, containerWidth, targetHeight, gap, true);
      }
    }

    $justifiedGrids.each(function () {
      var $grid = $(this);

      $grid.imagesLoaded(function () {
        layoutJustifiedGrid($grid);
      });
    });

    $containers.each(function () {
      var $container = $(this);
      var itemSelector = ".grid-item, .lightbox-gallery .image";

      $container.imagesLoaded(function () {
        $container.isotope({
          itemSelector: itemSelector,
          gutter: 0,
          transitionDuration: "0.5s",
          columnWidth: ".grid-item",
          percentPosition: true,
        });
      });
    });

    // Filter click logic for both the hidden menu and the inline tags
    $(".portfolio_filter ul li a, .filter-nav li a")
      .off("click")
      .on("click", function () {
      var $link = $(this);
      var $portfolio = $link.closest("#portfolio, .portfolio");
      var $targetGrid = $portfolio.find(".js-filter-grid").first();
      var $filterLinks = $link.closest("ul").find("a");

      if (!$targetGrid.length) {
        $targetGrid = $(".masonry").first();
      }

      if (!$targetGrid.length) {
        return false;
      }

      $filterLinks.removeClass("select-cat active");
      $link.addClass("select-cat active");
      if ($link.closest(".portfolio_filter").length) {
        $(".portfolio_filter ul li a, .filter-nav li a")
          .not($filterLinks)
          .removeClass("select-cat active");
      }

      var selector = $link.attr("data-filter");

      if ($targetGrid.hasClass("js-filter-grid")) {
        $targetGrid.children(".grid-item").each(function () {
          var $item = $(this);
          var matches = selector === "*" || $item.is(selector);

          $item.toggle(matches);
        });

        layoutJustifiedGrid($targetGrid);
        return false;
      }

      $targetGrid.isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
      return false;
    });

    $(window)
      .off("resize.justifiedGrid")
      .on("resize.justifiedGrid", function () {
        $justifiedGrids.each(function () {
          layoutJustifiedGrid($(this));
        });
      });

    $(".filter-icon")
      .off("click")
      .on("click", function () {
      $(".portfolio_filter").addClass("show");
    });

    $(".portfolio_filter")
      .off("click")
      .on("click", function (event) {
      if (!$(event.target).is(".portfolio_filter ul li a")) {
        $(".portfolio_filter").removeClass("show");
        return false;
      }
    });

    var $container = $(".masonry").first();
    if (!$container.length) {
      return;
    }

    // Infinite Scroll
    var curPage = 1;
    var pagesNum = $("#pagination-selector").find("li a:last").text(); // Number of pages

    $container.infinitescroll(
      {
        itemSelector: ".grid-item",
        nextSelector: ".portfolio-pagination li a",
        navSelector: "#pagination-selector",
        extraScrollPx: 0,
        bufferPx: 0,
        maxPage: 6,
        loading: {
          finishedMsg: "No more works",
          msgText: '<div class="loader"><span></span></div>',
          speed: "slow",
          selector: ".load-more",
        },
      },
      // trigger Masonry as a callback
      function (newElements) {
        var $newElems = $(newElements);
        $newElems.imagesLoaded(function () {
          // Append masonry
          $newElems.animate({ opacity: 1 });
          $container.isotope("appended", $newElems, true);
        });
        // Check last page
        curPage++;
        if (curPage == pagesNum) {
          $(".load-more button").remove();
        }
        $(".load-more").find("button").css("visibility", "visible");
      }
    );

    $container.infinitescroll("unbind");
    // jQuery
    $container.on("append.infinitescroll", function (
      event,
      response,
      path,
      items
    ) {
      console.log("Loaded: " + path);
    });

    $(".load-more button").on("click", function () {
      setTimeout(function () {
        hovertrid();
        ZoomImage();
      }, 1000);
      $container.infinitescroll("retrieve");
      $(".load-more").find("button").css("visibility", "hidden");
      return false;
    });
  }

  /*--------------------------------------------------
    FULL MENU JS
---------------------------------------------------*/

  function SiteMenu() {
    var $doc = $(document),
      win = $(window),
      AnimationsArray = [];
    (window.SITE = {
      init: function () {
        var menu2 = $("#full-menu.fullmenu"),
          items2 = menu2.find(".navmenu>li"),
          toggle = $(".menu"),
          nav_menus =
            (toggle.find("span"),
            new TimelineLite({
              paused: !0,
              onStart: function () {
                menu2.css("display", "table");
              },
              onReverseComplete: function () {},
            })),
          close = $("#full-menu"),
          links = menu2.find("li.scroll > a");
        AnimationsArray.push(nav_menus),
          nav_menus
            .add(
              TweenLite.to(menu2, 0.5, {
                autoAlpha: 1,
                ease: Quart.easeOut,
              })
            )
            .staggerFrom(
              items2,
              0.1 * items2.length,
              {
                y: "50",
                opacity: 0,
                ease: Quart.easeOut,
              },
              0.1
            ),
          toggle.on("click", function () {
            return (
              toggle.data("toggled")
                ? (nav_menus.timeScale(1.6).reverse(),
                  toggle.data("toggled", !1))
                : (nav_menus.timeScale(1).restart(),
                  toggle.data("toggled", !0)),
              !1
            );
          }),
          close.on("click", function (event) {
            if (!$(event.target).is("li.scroll > a")) {
              return (
                nav_menus.timeScale(1.6).reverse(),
                toggle.data("toggled", !1),
                !1
              );
            }
          }),
          links.on("click", function () {
            var _this = $(this),
              url = _this.attr("href"),
              hash =
                -1 !== url.indexOf("#")
                  ? url.substring(url.indexOf("#") + 1)
                  : "",
              pos = $("#" + hash).offset().top - $(".header").outerHeight();
            return hash
              ? (nav_menus.timeScale(2).reverse(),
                toggle.data("toggled", !1),
                TweenMax.to(window, win.height() / 500, {
                  scrollTo: {
                    y: pos,
                  },
                  ease: Quart.easeOut,
                }),
                !1)
              : !0;
          });
      },
    }),
      $doc.ready(function () {
        window.SITE.init();
        $(".navmenu li a").on("click", function () {
          $("html, body").animate(
            { scrollTop: $(this.hash).offset().top + 1 },
            1000
          );
          return false;
        });
      });
  }

  /*--------------------------------------------------
    FIXED BUTTONS SETTINGS
---------------------------------------------------*/

  function fixed_buttons() {
    var vheight = $(window).height();
    $(".uptotop .holder").on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 800);
      return false;
    });
    $(".down-icon").on("click", function () {
      $("html, body").animate({ scrollTop: vheight }, 800);
      return false;
    });
  }

  function filtershow() {
    if ($(".filter-icon").length) {
      var $window = $(window);
      var vheight = $window.height();
      var window_bottom_position = $window.scrollTop() + vheight;
      var window_top_position = $window.scrollTop();
      var portfolio_position = $(".portfolio").offset().top;
      var portfolio_height = $(".portfolio").height();
      var section_pad = vheight / 5;
      if (window_bottom_position >= portfolio_position + 200) {
        $(".filter-icon").addClass("come");
      } else {
        $(".filter-icon").removeClass("come");
      }
      if (
        window_bottom_position >=
        portfolio_position + portfolio_height + section_pad + 20
      ) {
        $(".filter-icon").removeClass("come");
      }
    }
  }

  function showarrow() {
    if ($(".uptotop").length) {
      var $window = $(window);
      var vheight = $window.height();
      var window_bottom_position = $window.scrollTop() + vheight;
      if (window_bottom_position >= vheight + 500) {
        $(".uptotop").addClass("show");
      } else {
        $(".uptotop").removeClass("show");
      }
    }
  }
  $(window).on("scroll resize", function () {
    filtershow();
    showarrow();
  });

  function ZoomImage() {
    $("body")
      .find(".page-container")
      .each(function () {
        $("#clone-image").append($(this));
      });

    console.clear();

    var root = document.documentElement;
    var body = document.body;
    var pages = document.querySelectorAll(".page");
    var tiles = document.querySelectorAll(".portfolio-item");

    for (var i = 0; i < tiles.length; i++) {
      addListeners(tiles[i], pages[i]);
    }

    function addListeners(tile, page) {
      tile.addEventListener("click", function () {
        $(this).parent().addClass("above");
        setTimeout(function () {
          TweenMax.to(".portfolio-item", 0.3, {
            opacity: 0,
            delay: 0.2,
            ease: Power2.easeInOut,
          });
          TweenMax.to("header", 0.3, {
            opacity: 0,
            delay: 0.2,
            ease: Power2.easeInOut,
          });
          $(".portfolio-item").addClass("zom");
        }, 0);

        setTimeout(function () {
          animotion(tile, page);
        }, 50);
      });

      page.addEventListener("click", function () {
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
        onComplete: onComplete,
      };

      TweenLite.set(clone, from);
      TweenLite.to(clone, 0.6, style);

      function onComplete() {
        TweenLite.set(tothere, { visibility: "visible" });
        body.removeChild(clone);
      }
    }

    function calculate(element) {
      var rect = element.getBoundingClientRect();

      var scrollTop =
        window.pageYOffset || root.scrollTop || body.scrollTop || 0;
      var scrollLeft =
        window.pageXOffset || root.scrollLeft || body.scrollLeft || 0;

      var clientTop = root.clientTop || body.clientTop || 0;
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
    var owlcar = $(".owl-carousel");
    if (owlcar.length) {
      owlcar.each(function () {
        var $owl = $(this);
        var itemsData = $owl.data("items");
        var autoplayData = $owl.data("autoplay");
        var autoPlayTimeoutData = $owl.data("autoplaytimeout");
        var dotsData = $owl.data("dots");
        var navData = $owl.data("nav");
        var marginData = $owl.data("margin");
        var stagePaddingData = $owl.data("stagepadding");
        var itemsDesktopData = $owl.data("items-desktop");
        var itemsTabletData = $owl.data("items-tablet");
        var itemsTabletSmallData = $owl.data("items-tablet-small");
        $owl.owlCarousel({
          items: itemsData,
          dots: dotsData,
          nav: navData,
          margin: marginData,
          loop: true,
          stagePadding: stagePaddingData,
          autoplay: autoplayData,
          autoplayTimeout: autoPlayTimeoutData,
          navText: [
            "<i class='fas fa-angle-left'></i>",
            "<i class='fas fa-angle-right'></i>",
          ],
          responsive: {
            0: {
              items: itemsTabletSmallData,
              stagePadding: 0,
            },
            600: {
              items: itemsTabletData,
              stagePadding: 0,
            },
            1000: {
              items: itemsDesktopData,
            },
          },
        });
      });
    }
  }

  function HoverVideo() {
    var figure = $(".portfolio-item.video").hover(hoverVideo, hideVideo);
    function hoverVideo(e) {
      $("video", this).get(0).play();
    }
    function hideVideo(e) {
      $("video", this).get(0).pause();
    }
  }

  $("#myTab a").on("click", function (e) {
    e.preventDefault();
    $(this).tab("show");
  });

  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    e.target; // newly activated tab
    e.relatedTarget; // previous active tab
  });
});
// document end
