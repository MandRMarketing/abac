/*!----------------------------------------

	Custom JS for Child Theme v20

----------------------------------------*/

(function ($) {
    'use strict';
    //var $document = $(document);
    //var $window = $(window);
    var width = $(window).width();

    /*----------------------------------------
		On Ready
	----------------------------------------*/
    $(document).ready(function () {
        // Placeholder Polyfill
        $('input, textarea').placeholder();

        /* Mobile Nav Code */

        /* Click event for mobile-nav-search trigger */
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

        /* Click event for mobile nav .back-btn elements */
        $('.back-btn').click(function () {
            // Remove the 'expanded' class from all .mobile-nav-primary-item elements
            $('.mobile-nav-primary-item').removeClass('expanded');

            // Set the aria-expanded attribute to 'false' for all .mobile-nav-subnav-trigger elements
            $('.mobile-nav-subnav-trigger').attr('aria-expanded', 'false');
        });

        /* Click event for mobile-menu-trigger trigger */
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

        /* Click event for mobile-nav-subnav-trigger trigger */
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

        /* Click event for desktop-nav-search trigger */
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

        /* Click event for desktop-nav-subnav-trigger */
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

        /* Code for both Mobile and Desktop navs */

        /* Check for clicks on the document */
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

        /* Scroll event to remove 'desktop-menu-active' class when the user scrolls */
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

        /* Query all toggles on page and pass to Toggles function */
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
            function closeAllToggles() {
                toggles.forEach((toggle) => {
                    toggle
                        .querySelector('.toggle__trigger')
                        .setAttribute('aria-expanded', 'false');
                    toggle
                        .querySelector('.toggle__trigger')
                        .classList.remove('toggle--active');
                    toggle
                        .querySelector('.toggle__box')
                        .setAttribute('aria-hidden', 'true');
                    toggle.querySelector('.toggle__box').style.display = 'none';
                });
            }
            function toggleBehavior(e) {
                e.preventDefault();

                const $this = e.target;

                //if the toggle is contained in .image-content-box-overlay
                if (e.target.closest('.image-content-box-overlay')) {
                    closeAllToggles();
                }

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

                const box = $this.nextElementSibling;

                if ($this.closest('.image-overlays')) {
                    if (toggleBoxDisplay == 'block') {
                        console.log('open');
                        box.style.display = toggleBoxDisplay;
                        setTimeout(function () {
                            box.classList.remove('visually-hidden');
                        }, 20);
                    } else {
                        console.log('close');
                        box.classList.add('visually-hidden');
                        box.addEventListener(
                            'transitionend',
                            function (e) {
                                box.style.display = toggleBoxDisplay;
                            },
                            {
                                capture: false,
                                once: true,
                                passive: false,
                            }
                        );
                    }
                } else {
                    box.style.display = toggleBoxDisplay;
                }
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

        // loading animation
        $(document).ready(function () {
            $('#loading-delay').delay(400).fadeOut(300);
            setTimeout(function () {
                $(document.body).trigger('siteLoaded');
                $(document.body).addClass('site-loaded');
            }, 700);
        });
    });

    /* Create animation for stats cards section */
    document.addEventListener('DOMContentLoaded', () => {
        let counters = document.querySelectorAll(
            '.stats .cards__wrap__card strong span'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    setCounter(
                        entry.target,
                        parseInt(entry.target.textContent),
                        entry.target.classList.contains('percentage'),
                        entry.target.dataset.animated
                    );
                    entry.target.dataset.animated = true;
                } else {
                    entry.target.classList.remove('active');
                }
            });
        });

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    });

    /* Helper function for animation for stats cards section */
    function setCounter(element, number, isPercentage, animated) {
        if (animated === 'true') {
            element.textContent = number + (isPercentage ? '%' : '');
            return;
        }

        const duration = 2000; // Duration in milliseconds
        const increment = Math.ceil(number / (duration / 20));
        let counter = 0;

        let interval = setInterval(() => {
            if (counter <= number) {
                element.textContent = counter + (isPercentage ? '%' : '');
                counter += increment;
            } else {
                element.textContent = number + (isPercentage ? '%' : ''); // Ensure final value is accurate
                clearInterval(interval);
            }
        }, 20);
    }

    /*----------------------------------------
		On Resize
	----------------------------------------*/
    /*
	$window.resize(function() {

	});
	*/
})(jQuery);
