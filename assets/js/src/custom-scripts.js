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

        // Run Mobile Menu
        $(document.getElementById('secondary-navigation')).slicknav({
            label: 'MENU', // Label for menu button. Use an empty string for no label.
            //duplicate: true, // If true, the mobile menu is a copy of the original.
            //duration: true, // The duration of the sliding animation.
            //easingOpen: 'swing', // Easing used for open animations.
            //easingClose: 'swing' // Easing used for close animations.
            //closedSymbol: '►', // Character after collapsed parents.
            //openedSymbol: '▼', // Character after expanded parents.
            prependTo: $('#secondary-navigation'), // Element, jQuery object, or jQuery selector string to prepend the mobile menu to.
            //parentTag: 'a', // Element type for parent menu items.
            //closeOnClick: false, // Close menu when a link is clicked.
            allowParentLinks: true, // Allow clickable links as parent elements.
            //nestedParentLinks: true // If false, parent links will be separated from the sub-menu toggle.
            //showChildren: false // Show children of parent links by default.
            //removeIds: false // Remove IDs from all menu elements. Defaults to true if duplicate is true.
            removeClasses: true, // Remove classes from all menu elements.
            //brand: '' // Add branding to menu bar.
        });

        // Adds animation to menu bars for SlickNav
        $('a.slicknav_btn').click(function () {
            if ($(this).hasClass('slicknav_icon_animation')) {
                $(this).removeClass('slicknav_icon_animation');
                $(this).addClass('slicknav_animation_reset');
            } else {
                $(this).addClass('slicknav_icon_animation');
                $(this).removeClass('slicknav_animation_reset');
            }
        });

        // Magnific - For Video Only
        $('.popup-video').magnificPopup({
            disableOn: 480,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
        });

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

        // ---------------------------------------------------------
        // Sidbar Navigation Toggle behavior
        // ---------------------------------------------------------

        function sidebarDropdownToggle() {
            $('#side-navigation li').each(function () {
                $(this)
                    .has('ul')
                    .addClass('child-dropdown')
                    .append('<a href="#" class="dropdown-toggle"></a>')
                    .children('ul')
                    .hide();
            });

            $('#side-navigation li').on(
                'click',
                'a.dropdown-toggle',
                function (e) {
                    e.preventDefault();
                    $(this)
                        .toggleClass('active')
                        .prev()
                        .stop(true, true)
                        .slideToggle('normal');
                }
            );
        }

        $(window).load(sidebarDropdownToggle());

        // ---------------------------------------------------------
        // Navigation behavior
        // ---------------------------------------------------------

        function navigationMenu() {
            var menu = $('#navigation-content');
            var $body = $('body');

            // Switch focus to modal nav menu
            function retainFocus() {
                // Add focus to menu
                menu.attr('tabindex', '0');
                menu.focus();

                // Remove tab-index from anything not modal
                $('#main').children().attr('tabindex', '-1');
                $('#header').attr('tabindex', '-1');

                if ($body.hasClass('menu-open')) {
                    menu.focus();
                }
            }

            // Remove modal classes & attrs
            function removeModal() {
                if ($body.hasClass('menu-open')) {
                    $body.removeClass('menu-open');

                    // Remove aria-hidden attr
                    $('#main').removeAttr('aria-hidden', 'true');
                    $('#header').removeAttr('aria-hidden', 'true');
                }
            }

            // Move focus to menu
            function moveFocus() {
                $(document).focus(function (event) {
                    if ($body.hasClass('menu-open') && !menu.has(':focus')) {
                        event.stopPropagation();
                        menu.focus();
                    }
                });
            }

            // Restrict menu focus
            function restrictFocus() {
                // Return to first item on tab
                $('#navigation-content a:last').bind(
                    'focus keydown',
                    function (e) {
                        console.log('focus');

                        if (
                            e.keyCode === 9 &&
                            !e.shiftKey &&
                            $body.hasClass('menu-open')
                        ) {
                            e.preventDefault();
                        }
                    }
                ); //

                // Return to last item on tab
                $('#navigation-content button.close').bind(
                    'focus keydown',
                    function (e) {
                        if (
                            e.shiftKey &&
                            e.keyCode === 9 &&
                            $body.hasClass('menu-open')
                        ) {
                            e.preventDefault();
                        }
                    }
                );
            }

            // Open menu actions
            // $('#main-menu, #scroll-menu').click(function(){
            // 	$body.addClass('menu-open');

            // 	// Add aria-hidden attr
            // 	$('#main').attr('aria-hidden', 'true');
            // 	$('#header').attr('aria-hidden', 'true');

            // 	retainFocus();
            // 	moveFocus();
            // 	restrictFocus();
            // });

            $('#scroll-menu').click(function () {
                $('#navigation-menu').removeAttr('aria-hidden', 'true');
                $('#navigation-menu').attr('aria-expanded', 'true');

                var sibs = $('#navigation-menu').siblings('.menu-tab');
                sibs.removeAttr('aria-expanded', 'true');
                sibs.attr('aria-hidden', 'true');
            });

            // Close menu actions
            $('.modal-overlay, button.close').click(function () {
                removeModal();
            });

            // Close menu keyboard command
            $(document).keyup(function (e) {
                if (e.keyCode === 27) {
                    removeModal();
                }
            });

            // Open menu tabs
            $('#main-menu li a').click(function () {
                var aria = $(this).attr('aria-controls');
                var tab = $('#' + aria);
                var hidden = tab.attr('aria-hidden');
                var sibs = tab.siblings('.menu-tab');

                if (hidden === 'true') {
                    tab.removeAttr('aria-hidden', 'true');
                    tab.attr('aria-expanded', 'true');
                    sibs.removeAttr('aria-expanded', 'true');
                    sibs.attr('aria-hidden', 'true');
                }
            });
        }

        $(window).load(navigationMenu());

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
        $('#toggle-btn').click(function () {
            $(this).toggleClass('active');
            $('#mobile-menu').toggleClass('active');
            $('body').toggleClass('menu-active'); // Add a class to body for styling when the menu is active
            $('.mobile-nav-subnav-trigger').attr('aria-expanded', false);
            $('.mobile-nav-primary-item').removeClass('expanded');
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

        // Click event for desktop-nav-subnav-trigger
        $('.primary-item .desktop-nav-subnav-trigger').click(function (event) {
            // Prevent the default behavior of the anchor link
            event.preventDefault();
            // Close all desktop-nav-subnavs and set opacity to 0
            $('.desktop-nav-subnav').fadeOut(400, function () {
                // Remove inline style for opacity after fadeOut is complete
                $(this).css('opacity', '');
            });

            // Toggle the display property to 'flex' and fade in the opacity for the clicked subnav
            var subnav = $(this).next('.desktop-nav-subnav');
            subnav.css('display', 'flex').stop().fadeTo(400, 1);

            // Ensure 'desktop-menu-active' class is set on the body
            $('body').addClass('desktop-menu-active');
        });

        // Check for clicks on the document
        $(document).on('click', function (event) {
            // Check if the body has the class 'desktop-menu-active'
            if ($('body').hasClass('desktop-menu-active')) {
                // Check if the clicked element is not a .desktop-nav-subnav or .desktop-nav-subnav-trigger
                if (
                    !$(event.target).is(
                        '.desktop-nav-subnav, .desktop-nav-subnav-trigger'
                    )
                ) {
                    // Fade out all .desktop-nav-subnavs and set opacity to 0
                    $('.desktop-nav-subnav').fadeOut(400, function () {
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
            if (desktopNavSubnav.is(':visible')) {
                // Remove 'desktop-menu-active' class from the body
                $('body').removeClass('desktop-menu-active');

                // Close all desktop-nav-subnavs and set opacity to 0
                desktopNavSubnav.fadeOut(400, function () {
                    // Remove inline style for opacity after fadeOut is complete
                    $(this).css('opacity', '');
                    // Set display to 'none' after removing opacity style
                    $(this).css('display', 'none');
                });
            }
        });

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
