/*!----------------------------------------

	Custom JS for Child Theme v20

----------------------------------------*/

(function ($) {
    'use strict';
    //var $document = $(document);
    //var $window = $(window);
    var width = $(window).width();

    /*----------------------------------------
		Support Functions
	----------------------------------------*/

    /*----------------------------------------
		On Load 
	----------------------------------------*/
    //$window.load(function() {
    //});

    /*----------------------------------------
		On Ready
	----------------------------------------*/
    $(document).ready(function () {
        // Placeholder Polyfill
        $('input, textarea').placeholder();

        // Superfish it
        $('ul.inner-menu').superfish();

        /* Combine menu items */
        /**
		// Main Menu, actual UL
		var primaryMenu = jQuery("#menu-primary-menu");
		// Secondary Menu, jsut the LIs
		var topMenuItems = jQuery("#menu-header-menu li");
		
		// clone secondary items to the main menu & hide them                                                        
		topMenuItems.each(function(idx, li) {
						var menuItem = jQuery(li);
						menuItem.clone(true).appendTo(primaryMenu).addClass("for-slickNav");
		});
		**/

        // Magnific - Images & Galleries
        var groups = {};

        $("a[rel^='magnificMe']").each(function () {
            var id = parseInt($(this).attr('data-group'), 10);

            if (!groups[id]) {
                groups[id] = [];
            }

            groups[id].push(this);
        });

        $.each(groups, function () {
            $(this).magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                gallery: { enabled: true },

                image: {
                    verticalFit: true,
                    titleSrc: function (item) {
                        return (
                            '<a class="image-source-link" href="' +
                            item.src +
                            '" target="_blank">view file</a>'
                        );
                    },
                },
            });
        });

        // ---------------------------------------------------------
        // Object fit fallback
        // ---------------------------------------------------------

        var ms9 =
            /MSIE 9/i.test(navigator.userAgent) ||
            /rv:11.0/i.test(navigator.userAgent);
        var ms10 = /MSIE 10/i.test(navigator.userAgent);
        var edge = /Edge\/\d./i.test(navigator.userAgent);
        var safari =
            navigator.userAgent.indexOf('Safari') !== -1 &&
            navigator.userAgent.indexOf('Chrome') === -1;

        if (edge || ms10 || ms9 || safari) {
            $('.object-fit-image').each(function () {
                var $container = $(this);
                var imgUrl = $container.prop('src');
                if (imgUrl) {
                    $container
                        .parent()
                        .css('backgroundImage', 'url(' + imgUrl + ')')
                        .removeClass('object-fit-image')
                        .addClass('compat-object-fit');
                }
            });
        }

        // ---------------------------------------------------------
        // Responsive wrap for Wordpress aligned images
        // ---------------------------------------------------------

        $('img.alignleft').each(function () {
            var $this = $(this);

            if ($this.parent('a').length > 0) {
                $this
                    .parent('a')
                    .wrap('<span class="mobile-center-image"></span>');
            } else {
                $this.wrap('<span class="mobile-center-image"></span>');
            }
        });

        $('img.alignright').each(function () {
            var $this = $(this);

            if ($this.parent('a').length > 0) {
                $this
                    .parent('a')
                    .wrap('<span class="mobile-center-image"></span>');
            } else {
                $this.wrap('<span class="mobile-center-image"></span>');
            }
        });

        // ---------------------------------------------------------
        // Smooth in page scrolling
        // ---------------------------------------------------------
        /*		$("a[href*='#']:not([href='#'], [href^='#address'])").click(function() {
			if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
			  var target = $(this.hash);
			  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			  if (target.length) {
				$('html,body').animate({
				  scrollTop: target.offset().top-20
				}, 1000);
				return false;
			  }
			}
		});*/

        // ---------------------------------------------------------
        // Tabs v2
        // ---------------------------------------------------------

        $('ul.tabs').on('click', 'li', function (e) {
            e.preventDefault();

            var $this = $(this);
            var $parents = $this.parents('.tabs-wrapper');

            var tab_id = $this.attr('data-tab');

            $parents
                .find('.tabs li')
                .removeClass('tab-current')
                .children('a')
                .attr('aria-selected', 'false');
            $parents
                .find('.tab-content')
                .removeClass('tab-current')
                .attr('aria-hidden', 'true');

            $this
                .addClass('tab-current')
                .children('a')
                .attr('aria-selected', 'true');
            $('#' + tab_id)
                .addClass('tab-current')
                .attr('aria-hidden', 'false');
            $('.tab-content').attr('tabindex', -1).focus();
        });

        // ---------------------------------------------------------
        // Toggle
        // ---------------------------------------------------------
        $('.toggle').find('.box').hide();
        $('.mobile-toggle').find('.box').hide();
        $('.toggle-with-anchor').find('.box').hide();

        $('.toggle').on('click', '.trigger', function () {
            // Control ARIA landmarks on open
            if ($(this).attr('aria-expanded', 'false')) {
                $(this).attr('aria-expanded', 'true');
                $(this).next().attr('aria-hidden', 'false');
            }

            // Control ARIA landmarks on close
            if (
                $(this).hasClass('active') &&
                $(this).attr('aria-expanded', 'true')
            ) {
                $(this).attr('aria-expanded', 'false');
                $(this).next().attr('aria-hidden', 'true');
            }

            $(this)
                .toggleClass('active')
                .next()
                .stop(true, true)
                .slideToggle('normal');

            return false;
        });

        $('.mobile-toggle').on('click', '.trigger', function () {
            // Control ARIA landmarks on open
            if ($(this).attr('aria-expanded', 'false')) {
                $(this).attr('aria-expanded', 'true');
                $(this).next().attr('aria-hidden', 'false');
            }

            // Control ARIA landmarks on close
            if (
                $(this).hasClass('active') &&
                $(this).attr('aria-expanded', 'true')
            ) {
                $(this).attr('aria-expanded', 'false');
                $(this).next().attr('aria-hidden', 'true');
            }

            $(this)
                .toggleClass('active')
                .next()
                .stop(true, true)
                .slideToggle('normal');

            return false;
        });

        $('.toggle-with-anchor').on('click', '.toggle-dropdown', function () {
            // Control ARIA landmarks on open
            if ($(this).attr('aria-expanded', 'false')) {
                $(this).attr('aria-expanded', 'true');
                $(this).next().attr('aria-hidden', 'false');
            }

            // Control ARIA landmarks on close
            if (
                $(this).hasClass('active') &&
                $(this).attr('aria-expanded', 'true')
            ) {
                $(this).attr('aria-expanded', 'false');
                $(this).next().attr('aria-hidden', 'true');
            }

            $(this)
                .toggleClass('active')
                .parent()
                .next()
                .stop(true, true)
                .slideToggle('normal');

            return false;
        });

        /*---------------------------------------------------------
			Javascript font size increase
		----------------------------------------------------------*/
        var size = parseInt($('p').css('font-size'));
        var anchor = parseInt($('a').css('font-size'));

        $('#big').on('click', function () {
            size += 2;
            $('p').css('font-size', size + 'px');
            $('a').css('font-size', anchor + 'px');
            $('#text-resize-example').text(size + 'px');
        });

        $('#small').on('click', function () {
            size -= 2;

            if (size >= 16) {
                $('p').css('font-size', size + 'px');
                $('a').css('font-size', anchor + 'px');
                $('#text-resize-example').text(size + 'px');
            } else {
                size = 16;
                $(this).prop('disable', true);
                $('p').css('font-size', size + 'px');
                $('a').css('font-size', anchor + 'px');
            }
        });

        //New code

        /* Mobile Nav Code */

        // Click event for mobile-nav-search trigger
        $('#mobile-search-trigger').click(function (event) {
            event.preventDefault();
            // Close all mobile-nav-subnavs and set opacity to 0
            $('#mobile-menu').removeClass('active');
            $('#mobile-menu-trigger').removeClass('active');
            $('.mobile-nav-primary-item').removeClass('expanded');
            $('.mobile-nav-subnav-trigger').attr('aria-expanded', 'false');

            $('body').removeClass('mobile-menu-active'); // Add a class to body for styling when the menu is active
            $(this).attr('aria-expanded', 'true');
            $('#mobile-search-form')
                .css('display', 'flex')
                .stop()
                .fadeTo(400, 1);
        });

        // Click event for mobile nav .back-btn elements
        $('.back-btn').click(function () {
            // Remove the 'expanded' class from all .mobile-nav-primary-item elements
            $('.mobile-nav-primary-item').removeClass('expanded');

            // Set the aria-expanded attribute to 'false' for all .mobile-nav-subnav-trigger elements
            $('.mobile-nav-subnav-trigger').attr('aria-expanded', 'false');
        });

        $('#mobile-menu-trigger').click(function () {
            $(this).toggleClass('active');
            $('#mobile-menu').toggleClass('active');
            $('body').toggleClass('mobile-menu-active'); // Add a class to body for styling when the menu is active
            $('.mobile-nav-subnav-trigger').attr('aria-expanded', false);
            $('.mobile-nav-primary-item').removeClass('expanded');
            $('#mobile-search-trigger').attr('aria-expanded', 'false');
            $('#mobile-search-form').fadeOut(400, function () {
                // Remove inline style for opacity after fadeOut is complete
                $(this).css('opacity', '');
                // Set display to 'none' after removing opacity style
                $(this).css('display', 'none');
            });
        });

        $('.mobile-nav-subnav-trigger').click(function () {
            // Get the current value of aria-expanded
            var currentValue = $(this).attr('aria-expanded');

            // Toggle the value
            var newValue = currentValue === 'true' ? 'false' : 'true';

            // Set the new value
            $(this).attr('aria-expanded', newValue);

            // Get the parent element and toggle the 'expanded' class
            $(this)
                .parent()
                .toggleClass('expanded', newValue === 'true');
        });

        /* Desktop Nav Code */

        // Click event for desktop-nav-search trigger
        $('#desktop-search-trigger').click(function (event) {
            event.preventDefault();
            // Close all desktop-nav-subnavs and set opacity to 0
            $('.desktop-nav-subnav').fadeOut(400, function () {
                // Remove inline style for opacity after fadeOut is complete
                $(this).css('opacity', '');
            });
            $(this).attr('aria-expanded', 'true');
            $('#desktop-search-form')
                .css('display', 'flex')
                .stop()
                .fadeTo(400, 1);

            // Ensure 'desktop-menu-active' class is set on the body
            $('body').addClass('desktop-menu-active');
        });

        // Click event for desktop-nav-subnav-trigger
        $('.primary-item .desktop-nav-subnav-trigger').click(function (event) {
            // Prevent the default behavior of the anchor link
            event.preventDefault();
            $('.desktop-nav-subnav-trigger').attr('aria-expanded', 'false');
            // Close all desktop-nav-subnavs and set opacity to 0
            $('.desktop-nav-subnav').fadeOut(400, function () {
                // Remove inline style for opacity after fadeOut is complete
                $(this).css('opacity', '');
            });

            $('#desktop-search-trigger').attr('aria-expanded', 'false');
            $('#desktop-search-form').fadeOut(400, function () {
                // Remove inline style for opacity after fadeOut is complete
                $(this).css('opacity', '');
                // Set display to 'none' after removing opacity style
                $(this).css('display', 'none');
            });

            // Set the new value
            $(this).attr('aria-expanded', 'true');
            // Toggle the display property to 'flex' and fade in the opacity for the clicked subnav
            var subnav = $(this).next('.desktop-nav-subnav');
            subnav.css('display', 'flex').stop().fadeTo(400, 1);

            // Ensure 'desktop-menu-active' class is set on the body
            $('body').addClass('desktop-menu-active');
        });

        //code for both mobile and desktop navs

        // Check for clicks on the document
        $(document).on('click', function (event) {
            // Check if the body has the class 'desktop-menu-active'
            if ($('body').hasClass('desktop-menu-active')) {
                // Check if the clicked element is not a .desktop-nav-subnav or .desktop-nav-subnav-trigger
                if (
                    !$(event.target).is(
                        '.desktop-nav-subnav, .desktop-nav-subnav-trigger, #desktop-search-trigger, #desktop-search-form, #desktop-search-form *, #mobile-search-trigger, mobile-search-form, mobile-search-form *'
                    )
                ) {
                    // Fade out all .desktop-nav-subnavs and set opacity to 0
                    $('.desktop-nav-subnav-trigger').attr(
                        'aria-expanded',
                        'false'
                    );
                    $('.desktop-nav-subnav').fadeOut(400, function () {
                        // Remove inline style for opacity after fadeOut is complete
                        $(this).css('opacity', '');
                        // Set display to 'none' after removing opacity style
                        $(this).css('display', 'none');
                    });

                    $('#desktop-search-trigger').attr('aria-expanded', 'false');
                    $('#desktop-search-form').fadeOut(400, function () {
                        // Remove inline style for opacity after fadeOut is complete
                        $(this).css('opacity', '');
                        // Set display to 'none' after removing opacity style
                        $(this).css('display', 'none');
                    });

                    $('#mobile-search-trigger').attr('aria-expanded', 'false');
                    $('#mobile-search-form').fadeOut(400, function () {
                        // Remove inline style for opacity after fadeOut is complete
                        $(this).css('opacity', '');
                        // Set display to 'none' after removing opacity style
                        $(this).css('display', 'none');
                    });

                    // Remove the 'desktop-menu-active' class from the body
                    $('body').removeClass('desktop-menu-active');
                }
            }
        });

        // Scroll event to remove 'desktop-menu-active' class when the user scrolls
        $(window).scroll(function () {
            // Check if the subnav is currently visible before fading out
            var desktopNavSubnav = $('.desktop-nav-subnav');
            var desktopSearchForm = $('#desktop-search-form');
            var mobileSearchForm = $('#mobile-search-form');
            if (
                desktopNavSubnav.is(':visible') ||
                desktopSearchForm.is(':visible') ||
                mobileSearchForm.is(':visible')
            ) {
                // Remove 'desktop-menu-active' class from the body
                $('body').removeClass('desktop-menu-active');

                // Close all desktop-nav-subnavs and set opacity to 0
                $('.desktop-nav-subnav-trigger').attr('aria-expanded', 'false');
                desktopNavSubnav.fadeOut(400, function () {
                    // Remove inline style for opacity after fadeOut is complete
                    $(this).css('opacity', '');
                    // Set display to 'none' after removing opacity style
                    $(this).css('display', 'none');
                });

                $('#desktop-search-trigger').attr('aria-expanded', 'false');
                desktopSearchForm.fadeOut(400, function () {
                    // Remove inline style for opacity after fadeOut is complete
                    $(this).css('opacity', '');
                    // Set display to 'none' after removing opacity style
                    $(this).css('display', 'none');
                });

                $('#mobile-search-trigger').attr('aria-expanded', 'false');
                $('#mobile-search-form').fadeOut(400, function () {
                    // Remove inline style for opacity after fadeOut is complete
                    $(this).css('opacity', '');
                    // Set display to 'none' after removing opacity style
                    $(this).css('display', 'none');
                });
            }
        });

        /* Content Box Overlay Code */
        $('.image-content-box-overlay .content-left .overlay-link').click(
            function (event) {
                $(
                    '.image-content-box-overlay .content-left .overlay-link'
                ).attr('aria-expanded', false);
                $(this).attr('aria-expanded', true);
                // Get the id
                var buttonID = $(this).data('id');
                $('.image-content-box-overlay .content-right .content').attr(
                    'aria-hidden',
                    'true'
                );
                var contentElement = $(
                    ".image-content-box-overlay .content-right .content[data-id='" +
                        buttonID +
                        "'"
                );
                contentElement.attr('aria-hidden', 'false');
            }
        );

        //Toggles code

        (function () {
            const toggles = document.querySelectorAll('.toggle');
            if (typeof toggles !== 'undefined' && toggles !== null) {
                Toggles(toggles);
            } else {
            }
        })();

        /**
         * Default toggle functionality
         *
         * @param {Node} toggles Node list of all toggles
         */
        function Toggles(toggles) {
            function toggleBehavior(e) {
                e.preventDefault();

                const $this = e.target;

                // Control ARIA landmarks on open
                if ($this.getAttribute('aria-expanded') === 'false') {
                    $this.setAttribute('aria-expanded', 'true');
                    $this.nextElementSibling.setAttribute(
                        'aria-hidden',
                        'false'
                    );
                } else if ($this.getAttribute('aria-expanded') === 'true') {
                    $this.setAttribute('aria-expanded', 'false');
                    $this.nextElementSibling.setAttribute(
                        'aria-hidden',
                        'true'
                    );
                }

                // Control ARIA landmarks on close
                if (
                    $this.classList.contains('active') &&
                    $this.getAttribute('aria-expanded') === 'true'
                ) {
                    $this.setAttribute('aria-expanded', 'false');
                    $this.nextElementSibling.setAttribute(
                        'aria-hidden',
                        'true'
                    );
                }

                // Check if toggle trigger has multiple children
                let triggerText = $this.querySelector('.toggle__trigger-text');
                if (triggerText !== null) {
                    const revealedText = triggerText.dataset.show;
                    const hiddenText = triggerText.dataset.hide;

                    // Only run if data attributes found
                    if (
                        typeof revealedText !== 'undefined' &&
                        typeof hiddenText !== 'undefined'
                    ) {
                        // Change value based on if toggle is active
                        const toggleText = $this.classList.contains(
                            'toggle--active'
                        )
                            ? triggerText.dataset.show
                            : triggerText.dataset.hide;

                        // Replace the current text value
                        triggerText.textContent = toggleText;
                    }
                }

                $this.classList.toggle('toggle--active');

                const toggleBoxDisplay = $this.classList.contains(
                    'toggle--active'
                )
                    ? 'block'
                    : 'none';
                $this.nextElementSibling.style.display = toggleBoxDisplay;
            }
            Array.prototype.slice.call(toggles, 0).forEach(function (e) {
                const toggleBox = e.querySelector('.toggle__box');

                // Check to make sure box is intended to be hidden on load
                if (toggleBox.getAttribute('aria-hidden') !== 'false') {
                    toggleBox.style.display = 'none';
                }

                e.querySelector('.toggle__trigger').addEventListener(
                    'click',
                    toggleBehavior
                );
            });
        }

        /*---------------------------------------------------------
			On Scroll
			-- fade in sections
		----------------------------------------------------------*/

        /*var $win = $(window);
		var $img = $('#find-your-greatness .diamond-fg'); // Change this to affect your desired element.

		$win.on('scroll', function () {
			var scrollTop = $win.scrollTop();

			$img.each(function () {
				var $self = $(this);
				var prev=$self.offset();
				if(prev){
					var pt=0;
					pt=prev.top-$win.height();    
					$self.css({
						opacity: (scrollTop-pt)/ ($self.offset().top-pt)
					});
				}
				else{
					$self.css({
						opacity: 1
					});
				}  
			});

		}).scroll();*/

        // ----------------------------------------
        // Buttons https://codepen.io/kjbrum/pen/wBBLXx
        // ----------------------------------------
        /*
        $('.button').append('<span></span>');
        
        $('.button').on('mouseenter', function(e) {
            var parentOffset = $(this).offset(),
            relX = e.pageX - parentOffset.left,
            relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX});
        }).on('mouseout', function(e) {
                var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX});
        });
        */
    });

    /*----------------------------------------
		On Resize
	----------------------------------------*/
    /*
	$window.resize(function() {

	});
	*/
})(jQuery);
