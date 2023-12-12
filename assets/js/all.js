/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-backgroundsize-generatedcontent-input-multiplebgs-setclasses-shiv-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
 */

(function (window, document, undefined) {
    var classes = [];

    var tests = [];

    /**
     *
     * ModernizrProto is the constructor for Modernizr
     *
     * @class
     * @access public
     */

    var ModernizrProto = {
        // The current version, dummy
        _version: '3.3.1',

        // Any settings that don't work as separate modules
        // can go in here as configuration.
        _config: {
            classPrefix: '',
            enableClasses: true,
            enableJSClass: true,
            usePrefixes: true,
        },

        // Queue of tests
        _q: [],

        // Stub these for people who are listening
        on: function (test, cb) {
            // I don't really think people should do this, but we can
            // safe guard it a bit.
            // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
            // This is in case people listen to synchronous tests. I would leave it out,
            // but the code to *disallow* sync tests in the real version of this
            // function is actually larger than this.
            var self = this;
            setTimeout(function () {
                cb(self[test]);
            }, 0);
        },

        addTest: function (name, fn, options) {
            tests.push({ name: name, fn: fn, options: options });
        },

        addAsyncTest: function (fn) {
            tests.push({ name: null, fn: fn });
        },
    };

    // Fake some of Object.create so we can force non test results to be non "own" properties.
    var Modernizr = function () {};
    Modernizr.prototype = ModernizrProto;

    // Leak modernizr globally when you `require` it rather than force it here.
    // Overwrite name so constructor name is nicer :D
    Modernizr = new Modernizr();

    /**
     * is returns a boolean if the typeof an obj is exactly type.
     *
     * @access private
     * @function is
     * @param {*} obj - A thing we want to check the type of
     * @param {string} type - A string to compare the typeof against
     * @returns {boolean}
     */

    function is(obj, type) {
        return typeof obj === type;
    }
    /**
     * Run through all tests and detect their support in the current UA.
     *
     * @access private
     */

    function testRunner() {
        var featureNames;
        var feature;
        var aliasIdx;
        var result;
        var nameIdx;
        var featureName;
        var featureNameSplit;

        for (var featureIdx in tests) {
            if (tests.hasOwnProperty(featureIdx)) {
                featureNames = [];
                feature = tests[featureIdx];
                // run the test, throw the return value into the Modernizr,
                // then based on that boolean, define an appropriate className
                // and push it into an array of classes we'll join later.
                //
                // If there is no name, it's an 'async' test that is run,
                // but not directly added to the object. That should
                // be done with a post-run addTest call.
                if (feature.name) {
                    featureNames.push(feature.name.toLowerCase());

                    if (
                        feature.options &&
                        feature.options.aliases &&
                        feature.options.aliases.length
                    ) {
                        // Add all the aliases into the names list
                        for (
                            aliasIdx = 0;
                            aliasIdx < feature.options.aliases.length;
                            aliasIdx++
                        ) {
                            featureNames.push(
                                feature.options.aliases[aliasIdx].toLowerCase()
                            );
                        }
                    }
                }

                // Run the test, or use the raw value if it's not a function
                result = is(feature.fn, 'function') ? feature.fn() : feature.fn;

                // Set each of the names on the Modernizr object
                for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
                    featureName = featureNames[nameIdx];
                    // Support dot properties as sub tests. We don't do checking to make sure
                    // that the implied parent tests have been added. You must call them in
                    // order (either in the test, or make the parent test a dependency).
                    //
                    // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
                    // hashtag famous last words
                    featureNameSplit = featureName.split('.');

                    if (featureNameSplit.length === 1) {
                        Modernizr[featureNameSplit[0]] = result;
                    } else {
                        // cast to a Boolean, if not one already
                        /* jshint -W053 */
                        if (
                            Modernizr[featureNameSplit[0]] &&
                            !(Modernizr[featureNameSplit[0]] instanceof Boolean)
                        ) {
                            Modernizr[featureNameSplit[0]] = new Boolean(
                                Modernizr[featureNameSplit[0]]
                            );
                        }

                        Modernizr[featureNameSplit[0]][featureNameSplit[1]] =
                            result;
                    }

                    classes.push(
                        (result ? '' : 'no-') + featureNameSplit.join('-')
                    );
                }
            }
        }
    }
    /**
     * docElement is a convenience wrapper to grab the root element of the document
     *
     * @access private
     * @returns {HTMLElement|SVGElement} The root element of the document
     */

    var docElement = document.documentElement;

    /**
     * A convenience helper to check if the document we are running in is an SVG document
     *
     * @access private
     * @returns {boolean}
     */

    var isSVG = docElement.nodeName.toLowerCase() === 'svg';

    /**
     * setClasses takes an array of class names and adds them to the root element
     *
     * @access private
     * @function setClasses
     * @param {string[]} classes - Array of class names
     */

    // Pass in an and array of class names, e.g.:
    //  ['no-webp', 'borderradius', ...]
    function setClasses(classes) {
        var className = docElement.className;
        var classPrefix = Modernizr._config.classPrefix || '';

        if (isSVG) {
            className = className.baseVal;
        }

        // Change `no-js` to `js` (independently of the `enableClasses` option)
        // Handle classPrefix on this too
        if (Modernizr._config.enableJSClass) {
            var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
            className = className.replace(reJS, '$1' + classPrefix + 'js$2');
        }

        if (Modernizr._config.enableClasses) {
            // Add the new classes
            className += ' ' + classPrefix + classes.join(' ' + classPrefix);
            isSVG
                ? (docElement.className.baseVal = className)
                : (docElement.className = className);
        }
    }

    /**
     * @optionName html5shiv
     * @optionProp html5shiv
     */

    // Take the html5 variable out of the html5shiv scope so we can return it.
    var html5;
    if (!isSVG) {
        /**
         * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
         */
        (function (window, document) {
            /*jshint evil:true */
            /** version */
            var version = '3.7.3';

            /** Preset options */
            var options = window.html5 || {};

            /** Used to skip problem elements */
            var reSkip =
                /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

            /** Not all elements can be cloned in IE **/
            var saveClones =
                /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

            /** Detect whether the browser supports default html5 styles */
            var supportsHtml5Styles;

            /** Name of the expando, to work with multiple documents or to re-shiv one document */
            var expando = '_html5shiv';

            /** The id for the the documents expando */
            var expanID = 0;

            /** Cached data for each document */
            var expandoData = {};

            /** Detect whether the browser supports unknown elements */
            var supportsUnknownElements;

            (function () {
                try {
                    var a = document.createElement('a');
                    a.innerHTML = '<xyz></xyz>';
                    //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
                    supportsHtml5Styles = 'hidden' in a;

                    supportsUnknownElements =
                        a.childNodes.length == 1 ||
                        (function () {
                            // assign a false positive if unable to shiv
                            document.createElement('a');
                            var frag = document.createDocumentFragment();
                            return (
                                typeof frag.cloneNode == 'undefined' ||
                                typeof frag.createDocumentFragment ==
                                    'undefined' ||
                                typeof frag.createElement == 'undefined'
                            );
                        })();
                } catch (e) {
                    // assign a false positive if detection fails => unable to shiv
                    supportsHtml5Styles = true;
                    supportsUnknownElements = true;
                }
            })();

            /*--------------------------------------------------------------------------*/

            /**
             * Creates a style sheet with the given CSS text and adds it to the document.
             * @private
             * @param {Document} ownerDocument The document.
             * @param {String} cssText The CSS text.
             * @returns {StyleSheet} The style element.
             */
            function addStyleSheet(ownerDocument, cssText) {
                var p = ownerDocument.createElement('p'),
                    parent =
                        ownerDocument.getElementsByTagName('head')[0] ||
                        ownerDocument.documentElement;

                p.innerHTML = 'x<style>' + cssText + '</style>';
                return parent.insertBefore(p.lastChild, parent.firstChild);
            }

            /**
             * Returns the value of `html5.elements` as an array.
             * @private
             * @returns {Array} An array of shived element node names.
             */
            function getElements() {
                var elements = html5.elements;
                return typeof elements == 'string'
                    ? elements.split(' ')
                    : elements;
            }

            /**
             * Extends the built-in list of html5 elements
             * @memberOf html5
             * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
             * @param {Document} ownerDocument The context document.
             */
            function addElements(newElements, ownerDocument) {
                var elements = html5.elements;
                if (typeof elements != 'string') {
                    elements = elements.join(' ');
                }
                if (typeof newElements != 'string') {
                    newElements = newElements.join(' ');
                }
                html5.elements = elements + ' ' + newElements;
                shivDocument(ownerDocument);
            }

            /**
             * Returns the data associated to the given document
             * @private
             * @param {Document} ownerDocument The document.
             * @returns {Object} An object of data.
             */
            function getExpandoData(ownerDocument) {
                var data = expandoData[ownerDocument[expando]];
                if (!data) {
                    data = {};
                    expanID++;
                    ownerDocument[expando] = expanID;
                    expandoData[expanID] = data;
                }
                return data;
            }

            /**
             * returns a shived element for the given nodeName and document
             * @memberOf html5
             * @param {String} nodeName name of the element
             * @param {Document|DocumentFragment} ownerDocument The context document.
             * @returns {Object} The shived element.
             */
            function createElement(nodeName, ownerDocument, data) {
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                if (supportsUnknownElements) {
                    return ownerDocument.createElement(nodeName);
                }
                if (!data) {
                    data = getExpandoData(ownerDocument);
                }
                var node;

                if (data.cache[nodeName]) {
                    node = data.cache[nodeName].cloneNode();
                } else if (saveClones.test(nodeName)) {
                    node = (data.cache[nodeName] =
                        data.createElem(nodeName)).cloneNode();
                } else {
                    node = data.createElem(nodeName);
                }

                // Avoid adding some elements to fragments in IE < 9 because
                // * Attributes like `name` or `type` cannot be set/changed once an element
                //   is inserted into a document/fragment
                // * Link elements with `src` attributes that are inaccessible, as with
                //   a 403 response, will cause the tab/window to crash
                // * Script elements appended to fragments will execute when their `src`
                //   or `text` property is set
                return node.canHaveChildren &&
                    !reSkip.test(nodeName) &&
                    !node.tagUrn
                    ? data.frag.appendChild(node)
                    : node;
            }

            /**
             * returns a shived DocumentFragment for the given document
             * @memberOf html5
             * @param {Document} ownerDocument The context document.
             * @returns {Object} The shived DocumentFragment.
             */
            function createDocumentFragment(ownerDocument, data) {
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                if (supportsUnknownElements) {
                    return ownerDocument.createDocumentFragment();
                }
                data = data || getExpandoData(ownerDocument);
                var clone = data.frag.cloneNode(),
                    i = 0,
                    elems = getElements(),
                    l = elems.length;
                for (; i < l; i++) {
                    clone.createElement(elems[i]);
                }
                return clone;
            }

            /**
             * Shivs the `createElement` and `createDocumentFragment` methods of the document.
             * @private
             * @param {Document|DocumentFragment} ownerDocument The document.
             * @param {Object} data of the document.
             */
            function shivMethods(ownerDocument, data) {
                if (!data.cache) {
                    data.cache = {};
                    data.createElem = ownerDocument.createElement;
                    data.createFrag = ownerDocument.createDocumentFragment;
                    data.frag = data.createFrag();
                }

                ownerDocument.createElement = function (nodeName) {
                    //abort shiv
                    if (!html5.shivMethods) {
                        return data.createElem(nodeName);
                    }
                    return createElement(nodeName, ownerDocument, data);
                };

                ownerDocument.createDocumentFragment = Function(
                    'h,f',
                    'return function(){' +
                        'var n=f.cloneNode(),c=n.createElement;' +
                        'h.shivMethods&&(' +
                        // unroll the `createElement` calls
                        getElements()
                            .join()
                            .replace(/[\w\-:]+/g, function (nodeName) {
                                data.createElem(nodeName);
                                data.frag.createElement(nodeName);
                                return 'c("' + nodeName + '")';
                            }) +
                        ');return n}'
                )(html5, data.frag);
            }

            /*--------------------------------------------------------------------------*/

            /**
             * Shivs the given document.
             * @memberOf html5
             * @param {Document} ownerDocument The document to shiv.
             * @returns {Document} The shived document.
             */
            function shivDocument(ownerDocument) {
                if (!ownerDocument) {
                    ownerDocument = document;
                }
                var data = getExpandoData(ownerDocument);

                if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                    data.hasCSS = !!addStyleSheet(
                        ownerDocument,
                        // corrects block display not defined in IE6/7/8/9
                        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                            // adds styling not present in IE6/7/8/9
                            'mark{background:#FF0;color:#000}' +
                            // hides non-rendered elements
                            'template{display:none}'
                    );
                }
                if (!supportsUnknownElements) {
                    shivMethods(ownerDocument, data);
                }
                return ownerDocument;
            }

            /*--------------------------------------------------------------------------*/

            /**
             * The `html5` object is exposed so that more elements can be shived and
             * existing shiving can be detected on iframes.
             * @type Object
             * @example
             *
             * // options can be changed before the script is included
             * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
             */
            var html5 = {
                /**
                 * An array or space separated string of node names of the elements to shiv.
                 * @memberOf html5
                 * @type Array|String
                 */
                elements:
                    options.elements ||
                    'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

                /**
                 * current version of html5shiv
                 */
                version: version,

                /**
                 * A flag to indicate that the HTML5 style sheet should be inserted.
                 * @memberOf html5
                 * @type Boolean
                 */
                shivCSS: options.shivCSS !== false,

                /**
                 * Is equal to true if a browser supports creating unknown/HTML5 elements
                 * @memberOf html5
                 * @type boolean
                 */
                supportsUnknownElements: supportsUnknownElements,

                /**
                 * A flag to indicate that the document's `createElement` and `createDocumentFragment`
                 * methods should be overwritten.
                 * @memberOf html5
                 * @type Boolean
                 */
                shivMethods: options.shivMethods !== false,

                /**
                 * A string to describe the type of `html5` object ("default" or "default print").
                 * @memberOf html5
                 * @type String
                 */
                type: 'default',

                // shivs the document according to the specified `html5` object options
                shivDocument: shivDocument,

                //creates a shived element
                createElement: createElement,

                //creates a shived documentFragment
                createDocumentFragment: createDocumentFragment,

                //extends list of elements
                addElements: addElements,
            };

            /*--------------------------------------------------------------------------*/

            // expose html5
            window.html5 = html5;

            // shiv the document
            shivDocument(document);

            if (typeof module == 'object' && module.exports) {
                module.exports = html5;
            }
        })(typeof window !== 'undefined' ? window : this, document);
    }
    /**
     * createElement is a convenience wrapper around document.createElement. Since we
     * use createElement all over the place, this allows for (slightly) smaller code
     * as well as abstracting away issues with creating elements in contexts other than
     * HTML documents (e.g. SVG documents).
     *
     * @access private
     * @function createElement
     * @returns {HTMLElement|SVGElement} An HTML or SVG element
     */

    function createElement() {
        if (typeof document.createElement !== 'function') {
            // This is the case in IE7, where the type of createElement is "object".
            // For this reason, we cannot call apply() as Object is not a Function.
            return document.createElement(arguments[0]);
        } else if (isSVG) {
            return document.createElementNS.call(
                document,
                'http://www.w3.org/2000/svg',
                arguments[0]
            );
        } else {
            return document.createElement.apply(document, arguments);
        }
    }

    /*!
{
  "name": "CSS Multiple Backgrounds",
  "caniuse": "multibackgrounds",
  "property": "multiplebgs",
  "tags": ["css"]
}
!*/

    // Setting multiple images AND a color on the background shorthand property
    // and then querying the style.background property value for the number of
    // occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

    Modernizr.addTest('multiplebgs', function () {
        var style = createElement('a').style;
        style.cssText =
            'background:url(https://),url(https://),red url(https://)';

        // If the UA supports multiple backgrounds, there should be three occurrences
        // of the string "url(" in the return value for elemStyle.background
        return /(url\s*\(.*?){3}/.test(style.background);
    });

    /**
     * since we have a fairly large number of input tests that don't mutate the input
     * we create a single element that can be shared with all of those tests for a
     * minor perf boost
     *
     * @access private
     * @returns {HTMLInputElement}
     */
    var inputElem = createElement('input');

    /*!
{
  "name": "Input attributes",
  "property": "input",
  "tags": ["forms"],
  "authors": ["Mike Taylor"],
  "notes": [{
    "name": "WHATWG spec",
    "href": "https://html.spec.whatwg.org/multipage/forms.html#input-type-attr-summary"
  }],
  "knownBugs": ["Some blackberry devices report false positive for input.multiple"]
}
!*/
    /* DOC
Detects support for HTML5 `<input>` element attributes and exposes Boolean subproperties with the results:

```javascript
Modernizr.input.autocomplete
Modernizr.input.autofocus
Modernizr.input.list
Modernizr.input.max
Modernizr.input.min
Modernizr.input.multiple
Modernizr.input.pattern
Modernizr.input.placeholder
Modernizr.input.required
Modernizr.input.step
```
*/

    // Run through HTML5's new input attributes to see if the UA understands any.
    // Mike Taylr has created a comprehensive resource for testing these attributes
    //   when applied to all input types:
    //   miketaylr.com/code/input-type-attr.html

    // Only input placeholder is tested while textarea's placeholder is not.
    // Currently Safari 4 and Opera 11 have support only for the input placeholder
    // Both tests are available in feature-detects/forms-placeholder.js

    var inputattrs =
        'autocomplete autofocus list placeholder max min multiple pattern required step'.split(
            ' '
        );
    var attrs = {};

    Modernizr.input = (function (props) {
        for (var i = 0, len = props.length; i < len; i++) {
            attrs[props[i]] = !!(props[i] in inputElem);
        }
        if (attrs.list) {
            // safari false positive's on datalist: webk.it/74252
            // see also github.com/Modernizr/Modernizr/issues/146
            attrs.list = !!(
                createElement('datalist') && window.HTMLDataListElement
            );
        }
        return attrs;
    })(inputattrs);

    /**
     * getBody returns the body of a document, or an element that can stand in for
     * the body if a real body does not exist
     *
     * @access private
     * @function getBody
     * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
     * artificially created element that stands in for the body
     */

    function getBody() {
        // After page load injecting a fake body doesn't work so check if body exists
        var body = document.body;

        if (!body) {
            // Can't use the real body create a fake one.
            body = createElement(isSVG ? 'svg' : 'body');
            body.fake = true;
        }

        return body;
    }

    /**
     * injectElementWithStyles injects an element with style element and some CSS rules
     *
     * @access private
     * @function injectElementWithStyles
     * @param {string} rule - String representing a css rule
     * @param {function} callback - A function that is used to test the injected element
     * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
     * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
     * @returns {boolean}
     */

    function injectElementWithStyles(rule, callback, nodes, testnames) {
        var mod = 'modernizr';
        var style;
        var ret;
        var node;
        var docOverflow;
        var div = createElement('div');
        var body = getBody();

        if (parseInt(nodes, 10)) {
            // In order not to give false positives we create a node for each test
            // This also allows the method to scale for unspecified uses
            while (nodes--) {
                node = createElement('div');
                node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                div.appendChild(node);
            }
        }

        style = createElement('style');
        style.type = 'text/css';
        style.id = 's' + mod;

        // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
        // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
        (!body.fake ? div : body).appendChild(style);
        body.appendChild(div);

        if (style.styleSheet) {
            style.styleSheet.cssText = rule;
        } else {
            style.appendChild(document.createTextNode(rule));
        }
        div.id = mod;

        if (body.fake) {
            //avoid crashing IE8, if background image is used
            body.style.background = '';
            //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
            body.style.overflow = 'hidden';
            docOverflow = docElement.style.overflow;
            docElement.style.overflow = 'hidden';
            docElement.appendChild(body);
        }

        ret = callback(div, rule);
        // If this is done after page load we don't want to remove the body so check if body exists
        if (body.fake) {
            body.parentNode.removeChild(body);
            docElement.style.overflow = docOverflow;
            // Trigger layout so kinetic scrolling isn't disabled in iOS6+
            docElement.offsetHeight;
        } else {
            div.parentNode.removeChild(div);
        }

        return !!ret;
    }

    /**
     * testStyles injects an element with style element and some CSS rules
     *
     * @memberof Modernizr
     * @name Modernizr.testStyles
     * @optionName Modernizr.testStyles()
     * @optionProp testStyles
     * @access public
     * @function testStyles
     * @param {string} rule - String representing a css rule
     * @param {function} callback - A function that is used to test the injected element
     * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
     * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
     * @returns {boolean}
     * @example
     *
     * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
     * along with (possibly multiple) DOM elements. This lets you check for features
     * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
     *
     * ```js
     * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
     *   // elem is the first DOM node in the page (by default #modernizr)
     *   // rule is the first argument you supplied - the CSS rule in string form
     *
     *   addTest('widthworks', elem.style.width === '9px')
     * });
     * ```
     *
     * If your test requires multiple nodes, you can include a third argument
     * indicating how many additional div elements to include on the page. The
     * additional nodes are injected as children of the `elem` that is returned as
     * the first argument to the callback.
     *
     * ```js
     * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
     *   document.getElementById('modernizr').style.width === '1px'; // true
     *   document.getElementById('modernizr2').style.width === '2px'; // true
     *   elem.firstChild === document.getElementById('modernizr2'); // true
     * }, 1);
     * ```
     *
     * By default, all of the additional elements have an ID of `modernizr[n]`, where
     * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
     * the second additional is `#modernizr3`, etc.).
     * If you want to have more meaningful IDs for your function, you can provide
     * them as the fourth argument, as an array of strings
     *
     * ```js
     * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
     *   elem.firstChild === document.getElementById('foo'); // true
     *   elem.lastChild === document.getElementById('bar'); // true
     * }, 2, ['foo', 'bar']);
     * ```
     *
     */

    var testStyles = (ModernizrProto.testStyles = injectElementWithStyles);

    /*!
{
  "name": "CSS Generated Content",
  "property": "generatedcontent",
  "tags": ["css"],
  "warnings": ["Android won't return correct height for anything below 7px #738"],
  "notes": [{
    "name": "W3C CSS Selectors Level 3 spec",
    "href": "https://www.w3.org/TR/css3-selectors/#gen-content"
  },{
    "name": "MDN article on :before",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  },{
    "name": "MDN article on :after",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/::before"
  }]
}
!*/

    testStyles(
        '#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}',
        function (node) {
            Modernizr.addTest('generatedcontent', node.offsetHeight >= 7);
        }
    );

    /**
   * If the browsers follow the spec, then they would expose vendor-specific style as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following, which would be technically incorrect:
   *   elem.style.webkitBorderRadius

   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

    var omPrefixes = 'Moz O ms Webkit';

    var cssomPrefixes = ModernizrProto._config.usePrefixes
        ? omPrefixes.split(' ')
        : [];
    ModernizrProto._cssomPrefixes = cssomPrefixes;

    /**
     * List of JavaScript DOM values used for tests
     *
     * @memberof Modernizr
     * @name Modernizr._domPrefixes
     * @optionName Modernizr._domPrefixes
     * @optionProp domPrefixes
     * @access public
     * @example
     *
     * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
     * than kebab-case properties, all properties are their Capitalized variant
     *
     * ```js
     * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
     * ```
     */

    var domPrefixes = ModernizrProto._config.usePrefixes
        ? omPrefixes.toLowerCase().split(' ')
        : [];
    ModernizrProto._domPrefixes = domPrefixes;

    /**
     * contains checks to see if a string contains another string
     *
     * @access private
     * @function contains
     * @param {string} str - The string we want to check for substrings
     * @param {string} substr - The substring we want to search the first string for
     * @returns {boolean}
     */

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    /**
     * cssToDOM takes a kebab-case string and converts it to camelCase
     * e.g. box-sizing -> boxSizing
     *
     * @access private
     * @function cssToDOM
     * @param {string} name - String name of kebab-case prop we want to convert
     * @returns {string} The camelCase version of the supplied name
     */

    function cssToDOM(name) {
        return name
            .replace(/([a-z])-([a-z])/g, function (str, m1, m2) {
                return m1 + m2.toUpperCase();
            })
            .replace(/^-/, '');
    }
    /**
     * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
     *
     * @access private
     * @function fnBind
     * @param {function} fn - a function you want to change `this` reference to
     * @param {object} that - the `this` you want to call the function with
     * @returns {function} The wrapped version of the supplied function
     */

    function fnBind(fn, that) {
        return function () {
            return fn.apply(that, arguments);
        };
    }

    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *
     * @access private
     * @function testDOMProps
     * @param {array.<string>} props - An array of properties to test for
     * @param {object} obj - An object or Element you want to use to test the parameters again
     * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
     */
    function testDOMProps(props, obj, elem) {
        var item;

        for (var i in props) {
            if (props[i] in obj) {
                // return the property name as a string
                if (elem === false) {
                    return props[i];
                }

                item = obj[props[i]];

                // let's bind a function
                if (is(item, 'function')) {
                    // bind to obj unless overriden
                    return fnBind(item, elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /**
     * Create our "modernizr" element that we do most feature tests on.
     *
     * @access private
     */

    var modElem = {
        elem: createElement('modernizr'),
    };

    // Clean up this element
    Modernizr._q.push(function () {
        delete modElem.elem;
    });

    var mStyle = {
        style: modElem.elem.style,
    };

    // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
    // the front of the queue.
    Modernizr._q.unshift(function () {
        delete mStyle.style;
    });

    /**
     * domToCSS takes a camelCase string and converts it to kebab-case
     * e.g. boxSizing -> box-sizing
     *
     * @access private
     * @function domToCSS
     * @param {string} name - String name of camelCase prop we want to convert
     * @returns {string} The kebab-case version of the supplied name
     */

    function domToCSS(name) {
        return name
            .replace(/([A-Z])/g, function (str, m1) {
                return '-' + m1.toLowerCase();
            })
            .replace(/^ms-/, '-ms-');
    }
    /**
     * nativeTestProps allows for us to use native feature detection functionality if available.
     * some prefixed form, or false, in the case of an unsupported rule
     *
     * @access private
     * @function nativeTestProps
     * @param {array} props - An array of property names
     * @param {string} value - A string representing the value we want to check via @supports
     * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
     */

    // Accepts a list of property names and a single value
    // Returns `undefined` if native detection not available
    function nativeTestProps(props, value) {
        var i = props.length;
        // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
        if ('CSS' in window && 'supports' in window.CSS) {
            // Try every prefixed variant of the property
            while (i--) {
                if (window.CSS.supports(domToCSS(props[i]), value)) {
                    return true;
                }
            }
            return false;
        }
        // Otherwise fall back to at-rule (for Opera 12.x)
        else if ('CSSSupportsRule' in window) {
            // Build a condition string for every prefixed variant
            var conditionText = [];
            while (i--) {
                conditionText.push(
                    '(' + domToCSS(props[i]) + ':' + value + ')'
                );
            }
            conditionText = conditionText.join(' or ');
            return injectElementWithStyles(
                '@supports (' +
                    conditionText +
                    ') { #modernizr { position: absolute; } }',
                function (node) {
                    return getComputedStyle(node, null).position == 'absolute';
                }
            );
        }
        return undefined;
    }
    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Property names can be provided in either camelCase or kebab-case.

    function testProps(props, prefixed, value, skipValueTest) {
        skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

        // Try native detect first
        if (!is(value, 'undefined')) {
            var result = nativeTestProps(props, value);
            if (!is(result, 'undefined')) {
                return result;
            }
        }

        // Otherwise do it properly
        var afterInit, i, propsLength, prop, before;

        // If we don't have a style element, that means we're running async or after
        // the core tests, so we'll need to create our own elements to use

        // inside of an SVG element, in certain browsers, the `style` element is only
        // defined for valid tags. Therefore, if `modernizr` does not have one, we
        // fall back to a less used element and hope for the best.
        var elems = ['modernizr', 'tspan'];
        while (!mStyle.style) {
            afterInit = true;
            mStyle.modElem = createElement(elems.shift());
            mStyle.style = mStyle.modElem.style;
        }

        // Delete the objects if we created them.
        function cleanElems() {
            if (afterInit) {
                delete mStyle.style;
                delete mStyle.modElem;
            }
        }

        propsLength = props.length;
        for (i = 0; i < propsLength; i++) {
            prop = props[i];
            before = mStyle.style[prop];

            if (contains(prop, '-')) {
                prop = cssToDOM(prop);
            }

            if (mStyle.style[prop] !== undefined) {
                // If value to test has been passed in, do a set-and-check test.
                // 0 (integer) is a valid property value, so check that `value` isn't
                // undefined, rather than just checking it's truthy.
                if (!skipValueTest && !is(value, 'undefined')) {
                    // Needs a try catch block because of old IE. This is slow, but will
                    // be avoided in most cases because `skipValueTest` will be used.
                    try {
                        mStyle.style[prop] = value;
                    } catch (e) {}

                    // If the property value has changed, we assume the value used is
                    // supported. If `value` is empty string, it'll fail here (because
                    // it hasn't changed), which matches how browsers have implemented
                    // CSS.supports()
                    if (mStyle.style[prop] != before) {
                        cleanElems();
                        return prefixed == 'pfx' ? prop : true;
                    }
                }
                // Otherwise just return true, or the property name if this is a
                // `prefixed()` call
                else {
                    cleanElems();
                    return prefixed == 'pfx' ? prop : true;
                }
            }
        }
        cleanElems();
        return false;
    }

    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     * We specify literally ALL possible (known and/or likely) properties on
     * the element including the non-vendor prefixed one, for forward-
     * compatibility.
     *
     * @access private
     * @function testPropsAll
     * @param {string} prop - A string of the property to test for
     * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
     * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
     * @param {string} [value] - A string of a css value
     * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
     */
    function testPropsAll(prop, prefixed, elem, value, skipValueTest) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (
                prop +
                ' ' +
                cssomPrefixes.join(ucProp + ' ') +
                ucProp
            ).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
            return testProps(props, prefixed, value, skipValueTest);

            // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
            props = (
                prop +
                ' ' +
                domPrefixes.join(ucProp + ' ') +
                ucProp
            ).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }

    // Modernizr.testAllProps() investigates whether a given style property,
    // or any of its vendor-prefixed variants, is recognized
    //
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    ModernizrProto.testAllProps = testPropsAll;

    /**
     * testAllProps determines whether a given CSS property is supported in the browser
     *
     * @memberof Modernizr
     * @name Modernizr.testAllProps
     * @optionName Modernizr.testAllProps()
     * @optionProp testAllProps
     * @access public
     * @function testAllProps
     * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
     * @param {string} [value] - String of the value to test
     * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
     * @example
     *
     * testAllProps determines whether a given CSS property, in some prefixed form,
     * is supported by the browser.
     *
     * ```js
     * testAllProps('boxSizing')  // true
     * ```
     *
     * It can optionally be given a CSS value in string form to test if a property
     * value is valid
     *
     * ```js
     * testAllProps('display', 'block') // true
     * testAllProps('display', 'penguin') // false
     * ```
     *
     * A boolean can be passed as a third parameter to skip the value check when
     * native detection (@supports) isn't available.
     *
     * ```js
     * testAllProps('shapeOutside', 'content-box', true);
     * ```
     */

    function testAllProps(prop, value, skipValueTest) {
        return testPropsAll(prop, undefined, undefined, value, skipValueTest);
    }
    ModernizrProto.testAllProps = testAllProps;

    /*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - https://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/

    Modernizr.addTest(
        'backgroundsize',
        testAllProps('backgroundSize', '100%', true)
    );

    // Run each test
    testRunner();

    // Remove the "no-js" class if it exists
    setClasses(classes);

    delete ModernizrProto.addTest;
    delete ModernizrProto.addAsyncTest;

    // Run the things that are supposed to run after the tests
    for (var i = 0; i < Modernizr._q.length; i++) {
        Modernizr._q[i]();
    }

    // Leak Modernizr namespace
    window.Modernizr = Modernizr;
})(window, document);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
        return (c / 2) * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
        return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
        return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        return (
            -(
                a *
                Math.pow(2, 10 * (t -= 1)) *
                Math.sin(((t * d - s) * (2 * Math.PI)) / p)
            ) + b
        );
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        return (
            a *
                Math.pow(2, -10 * t) *
                Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
            c +
            b
        );
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (0.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
        if (t < 1)
            return (
                -0.5 *
                    (a *
                        Math.pow(2, 10 * (t -= 1)) *
                        Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                b
            );
        return (
            a *
                Math.pow(2, -10 * (t -= 1)) *
                Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
                0.5 +
            c +
            b
        );
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1)
            return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d / 2)
            return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
        return (
            jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 +
            c * 0.5 +
            b
        );
    },
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
/*!
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery throttle / debounce: Sometimes, less is more!
//
// *Version: 1.1, Last updated: 3/7/2010*
//
// Project Home - http://benalman.com/projects/jquery-throttle-debounce-plugin/
// GitHub       - http://github.com/cowboy/jquery-throttle-debounce/
// Source       - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.js
// (Minified)   - http://github.com/cowboy/jquery-throttle-debounce/raw/master/jquery.ba-throttle-debounce.min.js (0.7kb)
//
// About: License
//
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
//
// Throttle - http://benalman.com/code/projects/jquery-throttle-debounce/examples/throttle/
// Debounce - http://benalman.com/code/projects/jquery-throttle-debounce/examples/debounce/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
//
// jQuery Versions - none, 1.3.2, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome 4-5, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-throttle-debounce/unit/
//
// About: Release History
//
// 1.1 - (3/7/2010) Fixed a bug in <jQuery.throttle> where trailing callbacks
//       executed later than they should. Reworked a fair amount of internal
//       logic as well.
// 1.0 - (3/6/2010) Initial release as a stand-alone project. Migrated over
//       from jquery-misc repo v0.4 to jquery-throttle repo v1.0, added the
//       no_trailing throttle parameter and debounce functionality.
//
// Topic: Note for non-jQuery users
//
// jQuery isn't actually required for this plugin, because nothing internal
// uses any jQuery methods or properties. jQuery is just used as a namespace
// under which these methods can exist.
//
// Since jQuery isn't actually required for this plugin, if jQuery doesn't exist
// when this plugin is loaded, the method described below will be created in
// the `Cowboy` namespace. Usage will be exactly the same, but instead of
// $.method() or jQuery.method(), you'll need to use Cowboy.method().

(function (window, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    // Since jQuery really isn't required for this plugin, use `jQuery` as the
    // namespace only if it already exists, otherwise use the `Cowboy` namespace,
    // creating it if necessary.
    var $ = window.jQuery || window.Cowboy || (window.Cowboy = {}),
        // Internal method reference.
        jq_throttle;

    // Method: jQuery.throttle
    //
    // Throttle execution of a function. Especially useful for rate limiting
    // execution of handlers on events like resize and scroll. If you want to
    // rate-limit execution of a function to a single time, see the
    // <jQuery.debounce> method.
    //
    // In this visualization, | is a throttled-function call and X is the actual
    // callback execution:
    //
    // > Throttled with `no_trailing` specified as false or unspecified:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // > X    X    X    X    X    X        X    X    X    X    X    X
    // >
    // > Throttled with `no_trailing` specified as true:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // > X    X    X    X    X             X    X    X    X    X
    //
    // Usage:
    //
    // > var throttled = jQuery.throttle( delay, [ no_trailing, ] callback );
    // >
    // > jQuery('selector').bind( 'someevent', throttled );
    // > jQuery('selector').unbind( 'someevent', throttled );
    //
    // This also works in jQuery 1.4+:
    //
    // > jQuery('selector').bind( 'someevent', jQuery.throttle( delay, [ no_trailing, ] callback ) );
    // > jQuery('selector').unbind( 'someevent', callback );
    //
    // Arguments:
    //
    //  delay - (Number) A zero-or-greater delay in milliseconds. For event
    //    callbacks, values around 100 or 250 (or even higher) are most useful.
    //  no_trailing - (Boolean) Optional, defaults to false. If no_trailing is
    //    true, callback will only execute every `delay` milliseconds while the
    //    throttled-function is being called. If no_trailing is false or
    //    unspecified, callback will be executed one final time after the last
    //    throttled-function call. (After the throttled-function has not been
    //    called for `delay` milliseconds, the internal counter is reset)
    //  callback - (Function) A function to be executed after delay milliseconds.
    //    The `this` context and all arguments are passed through, as-is, to
    //    `callback` when the throttled-function is executed.
    //
    // Returns:
    //
    //  (Function) A new, throttled, function.

    $.throttle = jq_throttle = function (
        delay,
        no_trailing,
        callback,
        debounce_mode
    ) {
        // After wrapper has stopped being called, this timeout ensures that
        // `callback` is executed at the proper times in `throttle` and `end`
        // debounce modes.
        var timeout_id,
            // Keep track of the last time `callback` was executed.
            last_exec = 0;

        // `no_trailing` defaults to falsy.
        if (typeof no_trailing !== 'boolean') {
            debounce_mode = callback;
            callback = no_trailing;
            no_trailing = undefined;
        }

        // The `wrapper` function encapsulates all of the throttling / debouncing
        // functionality and when executed will limit the rate at which `callback`
        // is executed.
        function wrapper() {
            var that = this,
                elapsed = +new Date() - last_exec,
                args = arguments;

            // Execute `callback` and update the `last_exec` timestamp.
            function exec() {
                last_exec = +new Date();
                callback.apply(that, args);
            }

            // If `debounce_mode` is true (at_begin) this is used to clear the flag
            // to allow future `callback` executions.
            function clear() {
                timeout_id = undefined;
            }

            if (debounce_mode && !timeout_id) {
                // Since `wrapper` is being called for the first time and
                // `debounce_mode` is true (at_begin), execute `callback`.
                exec();
            }

            // Clear any existing timeout.
            timeout_id && clearTimeout(timeout_id);

            if (debounce_mode === undefined && elapsed > delay) {
                // In throttle mode, if `delay` time has been exceeded, execute
                // `callback`.
                exec();
            } else if (no_trailing !== true) {
                // In trailing throttle mode, since `delay` time has not been
                // exceeded, schedule `callback` to execute `delay` ms after most
                // recent execution.
                //
                // If `debounce_mode` is true (at_begin), schedule `clear` to execute
                // after `delay` ms.
                //
                // If `debounce_mode` is false (at end), schedule `callback` to
                // execute after `delay` ms.
                timeout_id = setTimeout(
                    debounce_mode ? clear : exec,
                    debounce_mode === undefined ? delay - elapsed : delay
                );
            }
        }

        // Set the guid of `wrapper` function to the same of original callback, so
        // it can be removed in jQuery 1.4+ .unbind or .die by using the original
        // callback as a reference.
        if ($.guid) {
            wrapper.guid = callback.guid = callback.guid || $.guid++;
        }

        // Return the wrapper function.
        return wrapper;
    };

    // Method: jQuery.debounce
    //
    // Debounce execution of a function. Debouncing, unlike throttling,
    // guarantees that a function is only executed a single time, either at the
    // very beginning of a series of calls, or at the very end. If you want to
    // simply rate-limit execution of a function, see the <jQuery.throttle>
    // method.
    //
    // In this visualization, | is a debounced-function call and X is the actual
    // callback execution:
    //
    // > Debounced with `at_begin` specified as false or unspecified:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // >                          X                                 X
    // >
    // > Debounced with `at_begin` specified as true:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // > X                                 X
    //
    // Usage:
    //
    // > var debounced = jQuery.debounce( delay, [ at_begin, ] callback );
    // >
    // > jQuery('selector').bind( 'someevent', debounced );
    // > jQuery('selector').unbind( 'someevent', debounced );
    //
    // This also works in jQuery 1.4+:
    //
    // > jQuery('selector').bind( 'someevent', jQuery.debounce( delay, [ at_begin, ] callback ) );
    // > jQuery('selector').unbind( 'someevent', callback );
    //
    // Arguments:
    //
    //  delay - (Number) A zero-or-greater delay in milliseconds. For event
    //    callbacks, values around 100 or 250 (or even higher) are most useful.
    //  at_begin - (Boolean) Optional, defaults to false. If at_begin is false or
    //    unspecified, callback will only be executed `delay` milliseconds after
    //    the last debounced-function call. If at_begin is true, callback will be
    //    executed only at the first debounced-function call. (After the
    //    throttled-function has not been called for `delay` milliseconds, the
    //    internal counter is reset)
    //  callback - (Function) A function to be executed after delay milliseconds.
    //    The `this` context and all arguments are passed through, as-is, to
    //    `callback` when the debounced-function is executed.
    //
    // Returns:
    //
    //  (Function) A new, debounced, function.

    $.debounce = function (delay, at_begin, callback) {
        return callback === undefined
            ? jq_throttle(delay, at_begin, false)
            : jq_throttle(delay, callback, at_begin !== false);
    };
})(this);
(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true*/
    /*global define, Event, Node*/

    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;

        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;

        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;

        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;

        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;

        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;

        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;

        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function () {
                return method.apply(context, arguments);
            };
        }

        var methods = [
            'onMouse',
            'onClick',
            'onTouchStart',
            'onTouchMove',
            'onTouchEnd',
            'onTouchCancel',
        ];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function (type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(
                        layer,
                        type,
                        callback.hijacked || callback,
                        capture
                    );
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function (type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(
                        layer,
                        type,
                        callback.hijacked ||
                            (callback.hijacked = function (event) {
                                if (!event.propagationStopped) {
                                    callback(event);
                                }
                            }),
                        capture
                    );
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {
            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener(
                'click',
                function (event) {
                    oldOnClick(event);
                },
                false
            );
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone =
        navigator.userAgent.indexOf('Windows Phone') >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid =
        navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS =
        /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget =
        deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function (target) {
        switch (target.nodeName.toLowerCase()) {
            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':
                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if (
                    (deviceIsIOS && target.type === 'file') ||
                    target.disabled
                ) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return /\bneedsclick\b/.test(target.className);
    };

    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function (target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return /\bneedsfocus\b/.test(target.className);
        }
    };

    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function (targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (
            document.activeElement &&
            document.activeElement !== targetElement
        ) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(
            this.determineEventType(targetElement),
            true,
            true,
            window,
            1,
            touch.screenX,
            touch.screenY,
            touch.clientX,
            touch.clientY,
            false,
            false,
            false,
            false,
            0,
            null
        );

        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function (targetElement) {
        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (
            deviceIsAndroid &&
            targetElement.tagName.toLowerCase() === 'select'
        ) {
            return 'mousedown';
        }

        return 'click';
    };

    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function (targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        if (
            deviceIsIOS &&
            targetElement.setSelectionRange &&
            targetElement.type.indexOf('date') !== 0 &&
            targetElement.type !== 'time' &&
            targetElement.type !== 'month'
        ) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };

    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function (targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };

    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function (
        eventTarget
    ) {
        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };

    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function (event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {
            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {
                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (
                    touch.identifier &&
                    touch.identifier === this.lastTouchIdentifier
                ) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };

    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function (event) {
        var touch = event.changedTouches[0],
            boundary = this.touchBoundary;

        if (
            Math.abs(touch.pageX - this.touchStartX) > boundary ||
            Math.abs(touch.pageY - this.touchStartY) > boundary
        ) {
            return true;
        }

        return false;
    };

    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function (event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (
            this.targetElement !==
                this.getTargetElementFromEventTarget(event.target) ||
            this.touchHasMoved(event)
        ) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };

    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function (labelElement) {
        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector(
            'button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea'
        );
    };

    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function (event) {
        var forElement,
            trackingClickStart,
            targetTagName,
            scrollParent,
            touch,
            targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
            return true;
        }

        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement =
                document.elementFromPoint(
                    touch.pageX - window.pageXOffset,
                    touch.pageY - window.pageYOffset
                ) || targetElement;
            targetElement.fastClickScrollParent =
                this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {
            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if (
                event.timeStamp - trackingClickStart > 100 ||
                (deviceIsIOS &&
                    window.top !== window &&
                    targetTagName === 'input')
            ) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {
            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (
                scrollParent &&
                scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop
            ) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };

    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function () {
        this.trackingClick = false;
        this.targetElement = null;
    };

    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function (event) {
        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {
                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            event.preventDefault();

            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };

    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function (event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };

    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function () {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };

    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function (layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [
            ,
            0,
        ])[1];

        if (chromeVersion) {
            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (
                        metaViewport.content.indexOf('user-scalable=no') !== -1
                    ) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (
                        chromeVersion > 31 &&
                        document.documentElement.scrollWidth <=
                            window.outerWidth
                    ) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(
                /Version\/([0-9]*)\.([0-9]*)/
            );

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (
                        metaViewport.content.indexOf('user-scalable=no') !== -1
                    ) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (
                        document.documentElement.scrollWidth <=
                        window.outerWidth
                    ) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (
            layer.style.msTouchAction === 'none' ||
            layer.style.touchAction === 'manipulation'
        ) {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [
            ,
            0,
        ])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (
                metaViewport &&
                (metaViewport.content.indexOf('user-scalable=no') !== -1 ||
                    document.documentElement.scrollWidth <= window.outerWidth)
            ) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (
            layer.style.touchAction === 'none' ||
            layer.style.touchAction === 'manipulation'
        ) {
            return true;
        }

        return false;
    };

    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function (layer, options) {
        return new FastClick(layer, options);
    };

    if (
        typeof define === 'function' &&
        typeof define.amd === 'object' &&
        define.amd
    ) {
        // AMD. Register as an anonymous module.
        define(function () {
            return FastClick;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
})();
/*! respimage - v1.4.2 - 2015-08-22
 Licensed MIT */
!(function (window, document, undefined) {
    'use strict';
    function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }
    function updateMetrics() {
        var dprM;
        (isVwDirty = !1),
            (DPR = window.devicePixelRatio),
            (cssCache = {}),
            (sizeLengthCache = {}),
            (dprM = (DPR || 1) * cfg.xQuant),
            cfg.uT ||
                ((cfg.maxX = Math.max(1.3, cfg.maxX)),
                (dprM = Math.min(dprM, cfg.maxX)),
                (ri.DPR = dprM)),
            (units.width = Math.max(
                window.innerWidth || 0,
                docElem.clientWidth
            )),
            (units.height = Math.max(
                window.innerHeight || 0,
                docElem.clientHeight
            )),
            (units.vw = units.width / 100),
            (units.vh = units.height / 100),
            (units.em = ri.getEmValue()),
            (units.rem = units.em),
            (lazyFactor = cfg.lazyFactor / 2),
            (lazyFactor = lazyFactor * dprM + lazyFactor),
            (substractCurRes = 0.4 + 0.1 * dprM),
            (lowTreshHold = 0.5 + 0.2 * dprM),
            (partialLowTreshHold = 0.5 + 0.25 * dprM),
            (tMemory = dprM + 1.3),
            (isLandscape = units.width > units.height) || (lazyFactor *= 0.9),
            supportAbort && (lazyFactor *= 0.9),
            (evalID = [units.width, units.height, dprM].join('-'));
    }
    function chooseLowRes(lowRes, diff, dpr) {
        var add = diff * Math.pow(lowRes - 0.4, 1.9);
        return isLandscape || (add /= 1.3), (lowRes += add), lowRes > dpr;
    }
    function applyBestCandidate(img) {
        var srcSetCandidates,
            matchingSet = ri.getSet(img),
            evaluated = !1;
        'pending' != matchingSet &&
            ((evaluated = evalID),
            matchingSet &&
                ((srcSetCandidates = ri.setRes(matchingSet)),
                (evaluated = ri.applySetCandidate(srcSetCandidates, img)))),
            (img[ri.ns].evaled = evaluated);
    }
    function ascendingSort(a, b) {
        return a.res - b.res;
    }
    function setSrcToCur(img, src, set) {
        var candidate;
        return (
            !set &&
                src &&
                ((set = img[ri.ns].sets), (set = set && set[set.length - 1])),
            (candidate = getCandidateForSrc(src, set)),
            candidate &&
                ((src = ri.makeUrl(src)),
                (img[ri.ns].curSrc = src),
                (img[ri.ns].curCan = candidate),
                candidate.res || setResolution(candidate, candidate.set.sizes)),
            candidate
        );
    }
    function getCandidateForSrc(src, set) {
        var i, candidate, candidates;
        if (src && set)
            for (
                candidates = ri.parseSet(set), src = ri.makeUrl(src), i = 0;
                i < candidates.length;
                i++
            )
                if (src == ri.makeUrl(candidates[i].url)) {
                    candidate = candidates[i];
                    break;
                }
        return candidate;
    }
    function getAllSourceElements(picture, candidates) {
        var i,
            len,
            source,
            srcset,
            sources = picture.getElementsByTagName('source');
        for (i = 0, len = sources.length; len > i; i++)
            (source = sources[i]),
                (source[ri.ns] = !0),
                (srcset = source.getAttribute('srcset')),
                srcset &&
                    candidates.push({
                        srcset: srcset,
                        media: source.getAttribute('media'),
                        type: source.getAttribute('type'),
                        sizes: source.getAttribute('sizes'),
                    });
    }
    var lowTreshHold,
        partialLowTreshHold,
        isLandscape,
        lazyFactor,
        tMemory,
        substractCurRes,
        eminpx,
        alwaysCheckWDescriptor,
        resizeThrottle,
        evalID,
        ri = {},
        noop = function () {},
        image = document.createElement('img'),
        getImgAttr = image.getAttribute,
        setImgAttr = image.setAttribute,
        removeImgAttr = image.removeAttribute,
        docElem = document.documentElement,
        types = {},
        cfg = {
            xQuant: 1,
            lazyFactor: 0.4,
            maxX: 2,
        },
        srcAttr = 'data-pfsrc',
        srcsetAttr = srcAttr + 'set',
        reflowBug = 'webkitBackfaceVisibility' in docElem.style,
        ua = navigator.userAgent,
        supportAbort =
            /rident/.test(ua) ||
            (/ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35),
        curSrcProp = 'currentSrc',
        regWDesc = /\s+\+?\d+(e\d+)?w/,
        regSize = /((?:\([^)]+\)(?:\s*and\s*|\s*or\s*|\s*not\s*)?)+)?\s*(.+)/,
        regDescriptor = /^([\+eE\d\.]+)(w|x)$/,
        regHDesc = /\s*\d+h\s*/,
        setOptions = window.respimgCFG,
        baseStyle =
            ('https:' == location.protocol,
            'position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)'),
        fsCss = 'font-size:100%!important;',
        isVwDirty = !0,
        cssCache = {},
        sizeLengthCache = {},
        DPR = window.devicePixelRatio,
        units = {
            px: 1,
            in: 96,
        },
        anchor = document.createElement('a'),
        alreadyRun = !1,
        on = function (obj, evt, fn, capture) {
            obj.addEventListener
                ? obj.addEventListener(evt, fn, capture || !1)
                : obj.attachEvent && obj.attachEvent('on' + evt, fn);
        },
        memoize = function (fn) {
            var cache = {};
            return function (input) {
                return (
                    input in cache || (cache[input] = fn(input)), cache[input]
                );
            };
        },
        evalCSS = (function () {
            var regLength = /^([\d\.]+)(em|vw|px)$/,
                replace = function () {
                    for (
                        var args = arguments, index = 0, string = args[0];
                        ++index in args;

                    )
                        string = string.replace(args[index], args[++index]);
                    return string;
                },
                buidlStr = memoize(function (css) {
                    return (
                        'return ' +
                        replace(
                            (css || '').toLowerCase(),
                            /\band\b/g,
                            '&&',
                            /,/g,
                            '||',
                            /min-([a-z-\s]+):/g,
                            'e.$1>=',
                            /max-([a-z-\s]+):/g,
                            'e.$1<=',
                            /calc([^)]+)/g,
                            '($1)',
                            /(\d+[\.]*[\d]*)([a-z]+)/g,
                            '($1 * e.$2)',
                            /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,
                            ''
                        )
                    );
                });
            return function (css, length) {
                var parsedLength;
                if (!(css in cssCache))
                    if (
                        ((cssCache[css] = !1),
                        length && (parsedLength = css.match(regLength)))
                    )
                        cssCache[css] =
                            parsedLength[1] * units[parsedLength[2]];
                    else
                        try {
                            cssCache[css] = new Function('e', buidlStr(css))(
                                units
                            );
                        } catch (e) {}
                return cssCache[css];
            };
        })(),
        setResolution = function (candidate, sizesattr) {
            return (
                candidate.w
                    ? ((candidate.cWidth = ri.calcListLength(
                          sizesattr || '100vw'
                      )),
                      (candidate.res = candidate.w / candidate.cWidth))
                    : (candidate.res = candidate.x),
                candidate
            );
        },
        respimage = function (opt) {
            var elements,
                i,
                plen,
                options = opt || {};
            if (
                (options.elements &&
                    1 == options.elements.nodeType &&
                    ('IMG' == options.elements.nodeName.toUpperCase()
                        ? (options.elements = [options.elements])
                        : ((options.context = options.elements),
                          (options.elements = null))),
                options.reparse &&
                    ((options.reevaluate = !0),
                    window.console &&
                        console.warn &&
                        console.warn('reparse was renamed to reevaluate!')),
                (elements =
                    options.elements ||
                    ri.qsa(
                        options.context || document,
                        options.reevaluate || options.reselect
                            ? ri.sel
                            : ri.selShort
                    )),
                (plen = elements.length))
            ) {
                for (
                    ri.setupRun(options), alreadyRun = !0, i = 0;
                    plen > i;
                    i++
                )
                    ri.fillImg(elements[i], options);
                ri.teardownRun(options);
            }
        },
        parseDescriptor = memoize(function (descriptor) {
            var descriptorObj = [1, 'x'],
                parsedDescriptor = trim(descriptor || '');
            return (
                parsedDescriptor &&
                    ((parsedDescriptor = parsedDescriptor.replace(
                        regHDesc,
                        ''
                    )),
                    (descriptorObj = parsedDescriptor.match(regDescriptor)
                        ? [1 * RegExp.$1, RegExp.$2]
                        : !1)),
                descriptorObj
            );
        });
    if (
        (curSrcProp in image || (curSrcProp = 'src'),
        (types['image/jpeg'] = !0),
        (types['image/gif'] = !0),
        (types['image/png'] = !0),
        (types['image/svg+xml'] = document.implementation.hasFeature(
            'http://wwwindow.w3.org/TR/SVG11/feature#Image',
            '1.1'
        )),
        (ri.ns = ('ri' + new Date().getTime()).substr(0, 9)),
        (ri.supSrcset = 'srcset' in image),
        (ri.supSizes = 'sizes' in image),
        (ri.supPicture = !!window.HTMLPictureElement),
        ri.supSrcset &&
            ri.supPicture &&
            !ri.supSizes &&
            !(function (image2) {
                (image.srcset = 'data:,a'),
                    (image2.src = 'data:,a'),
                    (ri.supSrcset = image.complete === image2.complete),
                    (ri.supPicture = ri.supSrcset && ri.supPicture);
            })(document.createElement('img')),
        (ri.selShort = 'picture>img,img[srcset]'),
        (ri.sel = ri.selShort),
        (ri.cfg = cfg),
        ri.supSrcset && (ri.sel += ',img[' + srcsetAttr + ']'),
        (ri.DPR = DPR || 1),
        (ri.u = units),
        (ri.types = types),
        (alwaysCheckWDescriptor = ri.supSrcset && !ri.supSizes),
        (ri.setSize = noop),
        (ri.makeUrl = memoize(function (src) {
            return (anchor.href = src), anchor.href;
        })),
        (ri.qsa = function (context, sel) {
            return context.querySelectorAll(sel);
        }),
        (ri.matchesMedia = function () {
            return (
                (ri.matchesMedia =
                    window.matchMedia &&
                    (matchMedia('(min-width: 0.1em)') || {}).matches
                        ? function (media) {
                              return !media || matchMedia(media).matches;
                          }
                        : ri.mMQ),
                ri.matchesMedia.apply(this, arguments)
            );
        }),
        (ri.mMQ = function (media) {
            return media ? evalCSS(media) : !0;
        }),
        (ri.calcLength = function (sourceSizeValue) {
            var value = evalCSS(sourceSizeValue, !0) || !1;
            return 0 > value && (value = !1), value;
        }),
        (ri.supportsType = function (type) {
            return type ? types[type] : !0;
        }),
        (ri.parseSize = memoize(function (sourceSizeStr) {
            var match = (sourceSizeStr || '').match(regSize);
            return {
                media: match && match[1],
                length: match && match[2],
            };
        })),
        (ri.parseSet = function (set) {
            if (!set.cands) {
                var pos,
                    url,
                    descriptor,
                    last,
                    descpos,
                    can,
                    srcset = set.srcset;
                for (set.cands = []; srcset; )
                    (srcset = srcset.replace(/^\s+/g, '')),
                        (pos = srcset.search(/\s/g)),
                        (descriptor = null),
                        -1 != pos
                            ? ((url = srcset.slice(0, pos)),
                              (last = url.charAt(url.length - 1)),
                              (',' != last && url) ||
                                  ((url = url.replace(/,+$/, '')),
                                  (descriptor = '')),
                              (srcset = srcset.slice(pos + 1)),
                              null == descriptor &&
                                  ((descpos = srcset.indexOf(',')),
                                  -1 != descpos
                                      ? ((descriptor = srcset.slice(
                                            0,
                                            descpos
                                        )),
                                        (srcset = srcset.slice(descpos + 1)))
                                      : ((descriptor = srcset), (srcset = ''))))
                            : ((url = srcset), (srcset = '')),
                        url &&
                            (descriptor = parseDescriptor(descriptor)) &&
                            ((can = {
                                url: url.replace(/^,+/, ''),
                                set: set,
                            }),
                            (can[descriptor[1]] = descriptor[0]),
                            'x' == descriptor[1] &&
                                1 == descriptor[0] &&
                                (set.has1x = !0),
                            set.cands.push(can));
            }
            return set.cands;
        }),
        (ri.getEmValue = function () {
            var body;
            if (!eminpx && (body = document.body)) {
                var div = document.createElement('div'),
                    originalHTMLCSS = docElem.style.cssText,
                    originalBodyCSS = body.style.cssText;
                (div.style.cssText = baseStyle),
                    (docElem.style.cssText = fsCss),
                    (body.style.cssText = fsCss),
                    body.appendChild(div),
                    (eminpx = div.offsetWidth),
                    body.removeChild(div),
                    (eminpx = parseFloat(eminpx, 10)),
                    (docElem.style.cssText = originalHTMLCSS),
                    (body.style.cssText = originalBodyCSS);
            }
            return eminpx || 16;
        }),
        (ri.calcListLength = function (sourceSizeListStr) {
            if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
                var sourceSize,
                    parsedSize,
                    length,
                    media,
                    i,
                    len,
                    sourceSizeList = trim(sourceSizeListStr).split(/\s*,\s*/),
                    winningLength = !1;
                for (
                    i = 0, len = sourceSizeList.length;
                    len > i &&
                    ((sourceSize = sourceSizeList[i]),
                    (parsedSize = ri.parseSize(sourceSize)),
                    (length = parsedSize.length),
                    (media = parsedSize.media),
                    !length ||
                        !ri.matchesMedia(media) ||
                        (winningLength = ri.calcLength(length)) === !1);
                    i++
                );
                sizeLengthCache[sourceSizeListStr] = winningLength
                    ? winningLength
                    : units.width;
            }
            return sizeLengthCache[sourceSizeListStr];
        }),
        (ri.setRes = function (set) {
            var candidates;
            if (set) {
                candidates = ri.parseSet(set);
                for (var i = 0, len = candidates.length; len > i; i++)
                    setResolution(candidates[i], set.sizes);
            }
            return candidates;
        }),
        (ri.setRes.res = setResolution),
        (ri.applySetCandidate = function (candidates, img) {
            if (candidates.length) {
                var candidate,
                    dpr,
                    i,
                    j,
                    diff,
                    length,
                    bestCandidate,
                    curSrc,
                    curCan,
                    isSameSet,
                    candidateSrc,
                    abortCurSrc,
                    oldRes,
                    imageData = img[ri.ns],
                    evaled = evalID,
                    lazyF = lazyFactor,
                    sub = substractCurRes;
                if (
                    ((curSrc = imageData.curSrc || img[curSrcProp]),
                    (curCan =
                        imageData.curCan ||
                        setSrcToCur(img, curSrc, candidates[0].set)),
                    (dpr = ri.DPR),
                    (oldRes = curCan && curCan.res),
                    !bestCandidate &&
                        curSrc &&
                        ((abortCurSrc =
                            supportAbort &&
                            !img.complete &&
                            curCan &&
                            oldRes - 0.2 > dpr),
                        abortCurSrc ||
                            (curCan && !(tMemory > oldRes)) ||
                            (curCan &&
                                dpr > oldRes &&
                                oldRes > lowTreshHold &&
                                (partialLowTreshHold > oldRes &&
                                    ((lazyF *= 0.8), (sub += 0.04 * dpr)),
                                (curCan.res +=
                                    lazyF * Math.pow(oldRes - sub, 2))),
                            (isSameSet =
                                !imageData.pic ||
                                (curCan && curCan.set == candidates[0].set)),
                            curCan &&
                                isSameSet &&
                                curCan.res >= dpr &&
                                (bestCandidate = curCan))),
                    !bestCandidate)
                )
                    for (
                        oldRes &&
                            (curCan.res =
                                curCan.res - (curCan.res - oldRes) / 2),
                            candidates.sort(ascendingSort),
                            length = candidates.length,
                            bestCandidate = candidates[length - 1],
                            i = 0;
                        length > i;
                        i++
                    )
                        if (
                            ((candidate = candidates[i]), candidate.res >= dpr)
                        ) {
                            (j = i - 1),
                                (bestCandidate =
                                    candidates[j] &&
                                    (diff = candidate.res - dpr) &&
                                    (abortCurSrc ||
                                        curSrc != ri.makeUrl(candidate.url)) &&
                                    chooseLowRes(candidates[j].res, diff, dpr)
                                        ? candidates[j]
                                        : candidate);
                            break;
                        }
                return (
                    oldRes && (curCan.res = oldRes),
                    bestCandidate &&
                        ((candidateSrc = ri.makeUrl(bestCandidate.url)),
                        (imageData.curSrc = candidateSrc),
                        (imageData.curCan = bestCandidate),
                        candidateSrc != curSrc && ri.setSrc(img, bestCandidate),
                        ri.setSize(img)),
                    evaled
                );
            }
        }),
        (ri.setSrc = function (img, bestCandidate) {
            var origStyle;
            (img.src = bestCandidate.url),
                reflowBug &&
                    ((origStyle = img.style.zoom),
                    (img.style.zoom = '0.999'),
                    (img.style.zoom = origStyle));
        }),
        (ri.getSet = function (img) {
            var i,
                set,
                supportsType,
                match = !1,
                sets = img[ri.ns].sets;
            for (i = 0; i < sets.length && !match; i++)
                if (
                    ((set = sets[i]),
                    set.srcset &&
                        ri.matchesMedia(set.media) &&
                        (supportsType = ri.supportsType(set.type)))
                ) {
                    'pending' == supportsType && (set = supportsType),
                        (match = set);
                    break;
                }
            return match;
        }),
        (ri.parseSets = function (element, parent, options) {
            var srcsetAttribute,
                imageSet,
                isWDescripor,
                srcsetParsed,
                hasPicture = 'PICTURE' == parent.nodeName.toUpperCase(),
                imageData = element[ri.ns];
            (imageData.src === undefined || options.src) &&
                ((imageData.src = getImgAttr.call(element, 'src')),
                imageData.src
                    ? setImgAttr.call(element, srcAttr, imageData.src)
                    : removeImgAttr.call(element, srcAttr)),
                (imageData.srcset === undefined ||
                    !ri.supSrcset ||
                    element.srcset ||
                    options.srcset) &&
                    ((srcsetAttribute = getImgAttr.call(element, 'srcset')),
                    (imageData.srcset = srcsetAttribute),
                    (srcsetParsed = !0)),
                (imageData.sets = []),
                hasPicture &&
                    ((imageData.pic = !0),
                    getAllSourceElements(parent, imageData.sets)),
                imageData.srcset
                    ? ((imageSet = {
                          srcset: imageData.srcset,
                          sizes: getImgAttr.call(element, 'sizes'),
                      }),
                      imageData.sets.push(imageSet),
                      (isWDescripor =
                          (alwaysCheckWDescriptor || imageData.src) &&
                          regWDesc.test(imageData.srcset || '')),
                      isWDescripor ||
                          !imageData.src ||
                          getCandidateForSrc(imageData.src, imageSet) ||
                          imageSet.has1x ||
                          ((imageSet.srcset += ', ' + imageData.src),
                          imageSet.cands.push({
                              url: imageData.src,
                              x: 1,
                              set: imageSet,
                          })))
                    : imageData.src &&
                      imageData.sets.push({
                          srcset: imageData.src,
                          sizes: null,
                      }),
                (imageData.curCan = null),
                (imageData.curSrc = undefined),
                (imageData.supported = !(
                    hasPicture ||
                    (imageSet && !ri.supSrcset) ||
                    isWDescripor
                )),
                srcsetParsed &&
                    ri.supSrcset &&
                    !imageData.supported &&
                    (srcsetAttribute
                        ? (setImgAttr.call(
                              element,
                              srcsetAttr,
                              srcsetAttribute
                          ),
                          (element.srcset = ''))
                        : removeImgAttr.call(element, srcsetAttr)),
                imageData.supported &&
                    !imageData.srcset &&
                    ((!imageData.src && element.src) ||
                        element.src != ri.makeUrl(imageData.src)) &&
                    (null == imageData.src
                        ? element.removeAttribute('src')
                        : (element.src = imageData.src)),
                (imageData.parsed = !0);
        }),
        (ri.fillImg = function (element, options) {
            var parent,
                imageData,
                extreme = options.reselect || options.reevaluate;
            if (
                (element[ri.ns] || (element[ri.ns] = {}),
                (imageData = element[ri.ns]),
                extreme || imageData.evaled != evalID)
            ) {
                if (!imageData.parsed || options.reevaluate) {
                    if (((parent = element.parentNode), !parent)) return;
                    ri.parseSets(element, parent, options);
                }
                imageData.supported
                    ? (imageData.evaled = evalID)
                    : applyBestCandidate(element);
            }
        }),
        (ri.setupRun = function (options) {
            (!alreadyRun || isVwDirty || DPR != window.devicePixelRatio) &&
                (updateMetrics(),
                options.elements ||
                    options.context ||
                    clearTimeout(resizeThrottle));
        }),
        ri.supPicture
            ? ((respimage = noop), (ri.fillImg = noop))
            : (document.createElement('picture'),
              (function () {
                  var isDomReady,
                      regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/,
                      run = function () {
                          var readyState = document.readyState || '';
                          (timerId = setTimeout(
                              run,
                              'loading' == readyState ? 200 : 999
                          )),
                              document.body &&
                                  ((isDomReady =
                                      isDomReady || regReady.test(readyState)),
                                  ri.fillImgs(),
                                  isDomReady && clearTimeout(timerId));
                      },
                      resizeEval = function () {
                          ri.fillImgs();
                      },
                      onResize = function () {
                          clearTimeout(resizeThrottle),
                              (isVwDirty = !0),
                              (resizeThrottle = setTimeout(resizeEval, 99));
                      },
                      timerId = setTimeout(run, document.body ? 0 : 20);
                  on(window, 'resize', onResize),
                      on(document, 'readystatechange', run);
              })()),
        (ri.respimage = respimage),
        (ri.fillImgs = respimage),
        (ri.teardownRun = noop),
        (respimage._ = ri),
        (window.respimage = window.picturefill || respimage),
        !window.picturefill)
    )
        for (
            window.respimgCFG = {
                ri: ri,
                push: function (args) {
                    var name = args.shift();
                    'function' == typeof ri[name]
                        ? ri[name].apply(ri, args)
                        : ((cfg[name] = args[0]),
                          alreadyRun &&
                              ri.fillImgs({
                                  reselect: !0,
                              }));
                },
            };
            setOptions && setOptions.length;

        )
            window.respimgCFG.push(setOptions.shift());
    window.picturefill ||
        ((window.picturefill = window.respimage),
        window.picturefillCFG || (window.picturefillCFG = window.respimgCFG));
})(window, document);
/**
 * FF's first picture implementation is static and does not react to viewport changes, this tiny script fixes this.
 */
(function (window) {
    /*jshint eqnull:true */
    var ua = navigator.userAgent;

    if (
        window.HTMLPictureElement &&
        /ecko/.test(ua) &&
        ua.match(/rv\:(\d+)/) &&
        RegExp.$1 < 41
    ) {
        addEventListener(
            'resize',
            (function () {
                var timer;

                var dummySrc = document.createElement('source');

                var fixRespimg = function (img) {
                    var source, sizes;
                    var picture = img.parentNode;

                    if (picture.nodeName.toUpperCase() === 'PICTURE') {
                        source = dummySrc.cloneNode();

                        picture.insertBefore(source, picture.firstElementChild);
                        setTimeout(function () {
                            picture.removeChild(source);
                        });
                    } else if (
                        !img._pfLastSize ||
                        img.offsetWidth > img._pfLastSize
                    ) {
                        img._pfLastSize = img.offsetWidth;
                        sizes = img.sizes;
                        img.sizes += ',100vw';
                        setTimeout(function () {
                            img.sizes = sizes;
                        });
                    }
                };

                var findPictureImgs = function () {
                    var i;
                    var imgs = document.querySelectorAll(
                        'picture > img, img[srcset][sizes]'
                    );
                    for (i = 0; i < imgs.length; i++) {
                        fixRespimg(imgs[i]);
                    }
                };
                var onResize = function () {
                    clearTimeout(timer);
                    timer = setTimeout(findPictureImgs, 99);
                };
                var mq =
                    window.matchMedia && matchMedia('(orientation: landscape)');
                var init = function () {
                    onResize();

                    if (mq && mq.addListener) {
                        mq.addListener(onResize);
                    }
                };

                dummySrc.srcset =
                    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

                if (/^[c|i]|d$/.test(document.readyState || '')) {
                    init();
                } else {
                    document.addEventListener('DOMContentLoaded', init);
                }

                return onResize;
            })()
        );
    }
})(window);
/*
 * jQuery Superfish Menu Plugin - v1.7.9
 * Copyright (c) 2016 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

(function ($, w) {
    'use strict';

    var methods = (function () {
        // private properties and methods go here
        var c = {
                bcClass: 'sf-breadcrumb',
                menuClass: 'sf-js-enabled',
                anchorClass: 'sf-with-ul',
                menuArrowClass: 'sf-arrows',
            },
            ios = (function () {
                var ios =
                    /^(?![\w\W]*Windows Phone)[\w\W]*(iPhone|iPad|iPod)/i.test(
                        navigator.userAgent
                    );
                if (ios) {
                    // tap anywhere on iOS to unfocus a submenu
                    $('html').css('cursor', 'pointer').on('click', $.noop);
                }
                return ios;
            })(),
            wp7 = (function () {
                var style = document.documentElement.style;
                return (
                    'behavior' in style &&
                    'fill' in style &&
                    /iemobile/i.test(navigator.userAgent)
                );
            })(),
            unprefixedPointerEvents = (function () {
                return !!w.PointerEvent;
            })(),
            toggleMenuClasses = function ($menu, o, add) {
                var classes = c.menuClass,
                    method;
                if (o.cssArrows) {
                    classes += ' ' + c.menuArrowClass;
                }
                method = add ? 'addClass' : 'removeClass';
                $menu[method](classes);
            },
            setPathToCurrent = function ($menu, o) {
                return $menu
                    .find('li.' + o.pathClass)
                    .slice(0, o.pathLevels)
                    .addClass(o.hoverClass + ' ' + c.bcClass)
                    .filter(function () {
                        return $(this)
                            .children(o.popUpSelector)
                            .hide()
                            .show().length;
                    })
                    .removeClass(o.pathClass);
            },
            toggleAnchorClass = function ($li, add) {
                var method = add ? 'addClass' : 'removeClass';
                $li.children('a')[method](c.anchorClass);
            },
            toggleTouchAction = function ($menu) {
                var msTouchAction = $menu.css('ms-touch-action');
                var touchAction = $menu.css('touch-action');
                touchAction = touchAction || msTouchAction;
                touchAction = touchAction === 'pan-y' ? 'auto' : 'pan-y';
                $menu.css({
                    'ms-touch-action': touchAction,
                    'touch-action': touchAction,
                });
            },
            getMenu = function ($el) {
                return $el.closest('.' + c.menuClass);
            },
            getOptions = function ($el) {
                return getMenu($el).data('sfOptions');
            },
            over = function () {
                var $this = $(this),
                    o = getOptions($this);
                clearTimeout(o.sfTimer);
                $this.siblings().superfish('hide').end().superfish('show');
            },
            close = function (o) {
                o.retainPath = $.inArray(this[0], o.$path) > -1;
                this.superfish('hide');

                if (!this.parents('.' + o.hoverClass).length) {
                    o.onIdle.call(getMenu(this));
                    if (o.$path.length) {
                        $.proxy(over, o.$path)();
                    }
                }
            },
            out = function () {
                var $this = $(this),
                    o = getOptions($this);
                if (ios) {
                    $.proxy(close, $this, o)();
                } else {
                    clearTimeout(o.sfTimer);
                    o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
                }
            },
            touchHandler = function (e) {
                var $this = $(this),
                    o = getOptions($this),
                    $ul = $this.siblings(e.data.popUpSelector);

                if (o.onHandleTouch.call($ul) === false) {
                    return this;
                }

                if ($ul.length > 0 && $ul.is(':hidden')) {
                    $this.one('click.superfish', false);
                    if (
                        e.type === 'MSPointerDown' ||
                        e.type === 'pointerdown'
                    ) {
                        $this.trigger('focus');
                    } else {
                        $.proxy(over, $this.parent('li'))();
                    }
                }
            },
            applyHandlers = function ($menu, o) {
                var targets = 'li:has(' + o.popUpSelector + ')';
                if ($.fn.hoverIntent && !o.disableHI) {
                    $menu.hoverIntent(over, out, targets);
                } else {
                    $menu
                        .on('mouseenter.superfish', targets, over)
                        .on('mouseleave.superfish', targets, out);
                }
                var touchevent = 'MSPointerDown.superfish';
                if (unprefixedPointerEvents) {
                    touchevent = 'pointerdown.superfish';
                }
                if (!ios) {
                    touchevent += ' touchend.superfish';
                }
                if (wp7) {
                    touchevent += ' mousedown.superfish';
                }
                $menu
                    .on('focusin.superfish', 'li', over)
                    .on('focusout.superfish', 'li', out)
                    .on(touchevent, 'a', o, touchHandler);
            };

        return {
            // public methods
            hide: function (instant) {
                if (this.length) {
                    var $this = this,
                        o = getOptions($this);
                    if (!o) {
                        return this;
                    }
                    var not = o.retainPath === true ? o.$path : '',
                        $ul = $this
                            .find('li.' + o.hoverClass)
                            .add(this)
                            .not(not)
                            .removeClass(o.hoverClass)
                            .children(o.popUpSelector),
                        speed = o.speedOut;

                    if (instant) {
                        $ul.show();
                        speed = 0;
                    }
                    o.retainPath = false;

                    if (o.onBeforeHide.call($ul) === false) {
                        return this;
                    }

                    $ul.stop(true, true).animate(
                        o.animationOut,
                        speed,
                        function () {
                            var $this = $(this);
                            o.onHide.call($this);
                        }
                    );
                }
                return this;
            },
            show: function () {
                var o = getOptions(this);
                if (!o) {
                    return this;
                }
                var $this = this.addClass(o.hoverClass),
                    $ul = $this.children(o.popUpSelector);

                if (o.onBeforeShow.call($ul) === false) {
                    return this;
                }

                $ul.stop(true, true).animate(o.animation, o.speed, function () {
                    o.onShow.call($ul);
                });
                return this;
            },
            destroy: function () {
                return this.each(function () {
                    var $this = $(this),
                        o = $this.data('sfOptions'),
                        $hasPopUp;
                    if (!o) {
                        return false;
                    }
                    $hasPopUp = $this.find(o.popUpSelector).parent('li');
                    clearTimeout(o.sfTimer);
                    toggleMenuClasses($this, o);
                    toggleAnchorClass($hasPopUp);
                    toggleTouchAction($this);
                    // remove event handlers
                    $this.off('.superfish').off('.hoverIntent');
                    // clear animation's inline display style
                    $hasPopUp
                        .children(o.popUpSelector)
                        .attr('style', function (i, style) {
                            return style.replace(/display[^;]+;?/g, '');
                        });
                    // reset 'current' path classes
                    o.$path
                        .removeClass(o.hoverClass + ' ' + c.bcClass)
                        .addClass(o.pathClass);
                    $this.find('.' + o.hoverClass).removeClass(o.hoverClass);
                    o.onDestroy.call($this);
                    $this.removeData('sfOptions');
                });
            },
            init: function (op) {
                return this.each(function () {
                    var $this = $(this);
                    if ($this.data('sfOptions')) {
                        return false;
                    }
                    var o = $.extend({}, $.fn.superfish.defaults, op),
                        $hasPopUp = $this.find(o.popUpSelector).parent('li');
                    o.$path = setPathToCurrent($this, o);

                    $this.data('sfOptions', o);

                    toggleMenuClasses($this, o, true);
                    toggleAnchorClass($hasPopUp, true);
                    toggleTouchAction($this);
                    applyHandlers($this, o);

                    $hasPopUp.not('.' + c.bcClass).superfish('hide', true);

                    o.onInit.call(this);
                });
            },
        };
    })();

    $.fn.superfish = function (method, args) {
        if (methods[method]) {
            return methods[method].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            return $.error(
                'Method ' + method + ' does not exist on jQuery.fn.superfish'
            );
        }
    };

    $.fn.superfish.defaults = {
        popUpSelector: 'ul,.sf-mega', // within menu context
        hoverClass: 'sfHover',
        pathClass: 'overrideThisToUse',
        pathLevels: 1,
        delay: 800,
        animation: { opacity: 'show' },
        animationOut: { opacity: 'hide' },
        speed: 'normal',
        speedOut: 'fast',
        cssArrows: true,
        disableHI: false,
        onInit: $.noop,
        onBeforeShow: $.noop,
        onShow: $.noop,
        onBeforeHide: $.noop,
        onHide: $.noop,
        onIdle: $.noop,
        onDestroy: $.noop,
        onHandleTouch: $.noop,
    };
})(jQuery, window);
/*!
 * hoverIntent v1.8.1 // 2014.08.11 // jQuery v1.9.1+
 * http://briancherne.github.io/jquery-hoverIntent/
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */

/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (jQuery && !jQuery.fn.hoverIntent) {
        factory(jQuery);
    }
})(function ($) {
    'use strict';

    // default configuration values
    var _cfg = {
        interval: 100,
        sensitivity: 6,
        timeout: 0,
    };

    // counter used to generate an ID for each instance
    var INSTANCE_COUNT = 0;

    // current X and Y position of mouse, updated during mousemove tracking (shared across instances)
    var cX, cY;

    // saves the current pointer position coordinates based on the given mousemove event
    var track = function (ev) {
        cX = ev.pageX;
        cY = ev.pageY;
    };

    // compares current and previous mouse positions
    var compare = function (ev, $el, s, cfg) {
        // compare mouse positions to see if pointer has slowed enough to trigger `over` function
        if (
            Math.sqrt((s.pX - cX) * (s.pX - cX) + (s.pY - cY) * (s.pY - cY)) <
            cfg.sensitivity
        ) {
            $el.off(s.event, track);
            delete s.timeoutId;
            // set hoverIntent state as active for this element (permits `out` handler to trigger)
            s.isActive = true;
            // overwrite old mouseenter event coordinates with most recent pointer position
            ev.pageX = cX;
            ev.pageY = cY;
            // clear coordinate data from state object
            delete s.pX;
            delete s.pY;
            return cfg.over.apply($el[0], [ev]);
        } else {
            // set previous coordinates for next comparison
            s.pX = cX;
            s.pY = cY;
            // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
            s.timeoutId = setTimeout(function () {
                compare(ev, $el, s, cfg);
            }, cfg.interval);
        }
    };

    // triggers given `out` function at configured `timeout` after a mouseleave and clears state
    var delay = function (ev, $el, s, out) {
        delete $el.data('hoverIntent')[s.id];
        return out.apply($el[0], [ev]);
    };

    $.fn.hoverIntent = function (handlerIn, handlerOut, selector) {
        // instance ID, used as a key to store and retrieve state information on an element
        var instanceId = INSTANCE_COUNT++;

        // extend the default configuration and parse parameters
        var cfg = $.extend({}, _cfg);
        if ($.isPlainObject(handlerIn)) {
            cfg = $.extend(cfg, handlerIn);
            if (!$.isFunction(cfg.out)) {
                cfg.out = cfg.over;
            }
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, {
                over: handlerIn,
                out: handlerOut,
                selector: selector,
            });
        } else {
            cfg = $.extend(cfg, {
                over: handlerIn,
                out: handlerIn,
                selector: handlerOut,
            });
        }

        // A private function for handling mouse 'hovering'
        var handleHover = function (e) {
            // cloned event to pass to handlers (copy required for event object to be passed in IE)
            var ev = $.extend({}, e);

            // the current target of the mouse event, wrapped in a jQuery object
            var $el = $(this);

            // read hoverIntent data from element (or initialize if not present)
            var hoverIntentData = $el.data('hoverIntent');
            if (!hoverIntentData) {
                $el.data('hoverIntent', (hoverIntentData = {}));
            }

            // read per-instance state from element (or initialize if not present)
            var state = hoverIntentData[instanceId];
            if (!state) {
                hoverIntentData[instanceId] = state = { id: instanceId };
            }

            // state properties:
            // id = instance ID, used to clean up data
            // timeoutId = timeout ID, reused for tracking mouse position and delaying "out" handler
            // isActive = plugin state, true after `over` is called just until `out` is called
            // pX, pY = previously-measured pointer coordinates, updated at each polling interval
            // event = string representing the namespaced event used for mouse tracking

            // clear any existing timeout
            if (state.timeoutId) {
                state.timeoutId = clearTimeout(state.timeoutId);
            }

            // namespaced event used to register and unregister mousemove tracking
            var mousemove = (state.event =
                'mousemove.hoverIntent.hoverIntent' + instanceId);

            // handle the event, based on its type
            if (e.type === 'mouseenter') {
                // do nothing if already active
                if (state.isActive) {
                    return;
                }
                // set "previous" X and Y position based on initial entry point
                state.pX = ev.pageX;
                state.pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $el.off(mousemove, track).on(mousemove, track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                state.timeoutId = setTimeout(function () {
                    compare(ev, $el, state, cfg);
                }, cfg.interval);
            } else {
                // "mouseleave"
                // do nothing if not already active
                if (!state.isActive) {
                    return;
                }
                // unbind expensive mousemove event
                $el.off(mousemove, track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                state.timeoutId = setTimeout(function () {
                    delay(ev, $el, state, cfg.out);
                }, cfg.timeout);
            }
        };

        // listen for mouseenter and mouseleave
        return this.on(
            {
                'mouseenter.hoverIntent': handleHover,
                'mouseleave.hoverIntent': handleHover,
            },
            cfg.selector
        );
    };
});
/*!
 * SlickNav Responsive Mobile Menu v1.0.6
 * (c) 2015 Josh Cope
 * licensed under MIT
 */
(function ($, document, window) {
    var // default settings object.
        defaults = {
            label: 'MENU',
            duplicate: true,
            duration: 200,
            easingOpen: 'swing',
            easingClose: 'swing',
            closedSymbol: '&#9658;',
            openedSymbol: '&#9660;',
            prependTo: 'body',
            appendTo: '',
            parentTag: 'a',
            closeOnClick: false,
            allowParentLinks: false,
            nestedParentLinks: true,
            showChildren: false,
            removeIds: false,
            removeClasses: false,
            removeStyles: false,
            brand: '',
            init: function () {},
            beforeOpen: function () {},
            beforeClose: function () {},
            afterOpen: function () {},
            afterClose: function () {},
        },
        mobileMenu = 'slicknav',
        prefix = 'slicknav';

    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = mobileMenu;

        this.init();
    }

    Plugin.prototype.init = function () {
        var $this = this,
            menu = $(this.element),
            settings = this.settings,
            iconClass,
            menuBar;

        // clone menu if needed
        if (settings.duplicate) {
            $this.mobileNav = menu.clone();
            //remove ids from clone to prevent css issues
            $this.mobileNav.removeAttr('id');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('id');
            });
        } else {
            $this.mobileNav = menu;

            // remove ids if set
            $this.mobileNav.removeAttr('id');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('id');
            });
        }

        // remove classes if set
        if (settings.removeClasses) {
            $this.mobileNav.removeAttr('class');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('class');
            });
        }

        // remove styles if set
        if (settings.removeStyles) {
            $this.mobileNav.removeAttr('style');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('style');
            });
        }

        // styling class for the button
        iconClass = prefix + '_icon';

        if (settings.label === '') {
            iconClass += ' ' + prefix + '_no-text';
        }

        if (settings.parentTag == 'a') {
            settings.parentTag = 'a href="#"';
        }

        // create menu bar
        $this.mobileNav.attr('class', prefix + '_nav');
        menuBar = $('<div class="' + prefix + '_menu"></div>');
        if (settings.brand !== '') {
            var brand = $(
                '<div class="' + prefix + '_brand">' + settings.brand + '</div>'
            );
            $(menuBar).append(brand);
        }
        $this.btn = $(
            [
                '<' +
                    settings.parentTag +
                    ' aria-haspopup="true" tabindex="0" class="' +
                    prefix +
                    '_btn ' +
                    prefix +
                    '_collapsed">',
                '<span class="' +
                    prefix +
                    '_menutxt">' +
                    settings.label +
                    '</span>',
                '<span class="' + iconClass + '">',
                '<span class="' + prefix + '_icon-bar"></span>',
                '<span class="' + prefix + '_icon-bar"></span>',
                '<span class="' + prefix + '_icon-bar"></span>',
                '</span>',
                '</' + settings.parentTag + '>',
            ].join('')
        );
        $(menuBar).append($this.btn);
        if (settings.appendTo !== '') {
            $(settings.appendTo).append(menuBar);
        } else {
            $(settings.prependTo).prepend(menuBar);
        }
        menuBar.append($this.mobileNav);

        // iterate over structure adding additional structure
        var items = $this.mobileNav.find('li');
        $(items).each(function () {
            var item = $(this),
                data = {};
            data.children = item.children('ul').attr('role', 'menu');
            item.data('menu', data);

            // if a list item has a nested menu
            if (data.children.length > 0) {
                // select all text before the child menu
                // check for anchors

                var a = item.contents(),
                    containsAnchor = false,
                    nodes = [];

                $(a).each(function () {
                    if (!$(this).is('ul')) {
                        nodes.push(this);
                    } else {
                        return false;
                    }

                    if ($(this).is('a')) {
                        containsAnchor = true;
                    }
                });

                var wrapElement = $(
                    '<' +
                        settings.parentTag +
                        ' role="menuitem" aria-haspopup="true" tabindex="-1" class="' +
                        prefix +
                        '_item"/>'
                );

                // wrap item text with tag and add classes unless we are separating parent links
                if (
                    !settings.allowParentLinks ||
                    settings.nestedParentLinks ||
                    !containsAnchor
                ) {
                    var $wrap = $(nodes).wrapAll(wrapElement).parent();
                    $wrap.addClass(prefix + '_row');
                } else
                    $(nodes)
                        .wrapAll(
                            '<span class="' +
                                prefix +
                                '_parent-link ' +
                                prefix +
                                '_row"/>'
                        )
                        .parent();

                if (!settings.showChildren) {
                    item.addClass(prefix + '_collapsed');
                } else {
                    item.addClass(prefix + '_open');
                }

                item.addClass(prefix + '_parent');

                // create parent arrow. wrap with link if parent links and separating
                var arrowElement = $(
                    '<span class="' +
                        prefix +
                        '_arrow">' +
                        (settings.showChildren
                            ? settings.openedSymbol
                            : settings.closedSymbol) +
                        '</span>'
                );

                if (
                    settings.allowParentLinks &&
                    !settings.nestedParentLinks &&
                    containsAnchor
                )
                    arrowElement = arrowElement.wrap(wrapElement).parent();

                //append arrow
                $(nodes).last().after(arrowElement);
            } else if (item.children().length === 0) {
                item.addClass(prefix + '_txtnode');
            }

            // accessibility for links
            item.children('a')
                .attr('role', 'menuitem')
                .click(function (event) {
                    //Ensure that it's not a parent
                    if (
                        settings.closeOnClick &&
                        !$(event.target)
                            .parent()
                            .closest('li')
                            .hasClass(prefix + '_parent')
                    ) {
                        //Emulate menu close if set
                        $($this.btn).click();
                    }
                });

            //also close on click if parent links are set
            if (settings.closeOnClick && settings.allowParentLinks) {
                item.children('a')
                    .children('a')
                    .click(function (event) {
                        //Emulate menu close
                        $($this.btn).click();
                    });

                item.find(
                    '.' + prefix + '_parent-link a:not(.' + prefix + '_item)'
                ).click(function (event) {
                    //Emulate menu close
                    $($this.btn).click();
                });
            }
        });

        // structure is in place, now hide appropriate items
        $(items).each(function () {
            var data = $(this).data('menu');
            if (!settings.showChildren) {
                $this._visibilityToggle(data.children, null, false, null, true);
            }
        });

        // finally toggle entire menu
        $this._visibilityToggle($this.mobileNav, null, false, 'init', true);

        // accessibility for menu button
        $this.mobileNav.attr('role', 'menu');

        // outline prevention when using mouse
        $(document).mousedown(function () {
            $this._outlines(false);
        });

        $(document).keyup(function () {
            $this._outlines(true);
        });

        // menu button click
        $($this.btn).click(function (e) {
            e.preventDefault();
            $this._menuToggle();
        });

        // click on menu parent
        $this.mobileNav.on('click', '.' + prefix + '_item', function (e) {
            e.preventDefault();
            $this._itemClick($(this));
        });

        // check for enter key on menu button and menu parents
        $($this.btn).keydown(function (e) {
            var ev = e || event;
            if (ev.keyCode == 13) {
                e.preventDefault();
                $this._menuToggle();
            }
        });

        $this.mobileNav.on('keydown', '.' + prefix + '_item', function (e) {
            var ev = e || event;
            if (ev.keyCode == 13) {
                e.preventDefault();
                $this._itemClick($(e.target));
            }
        });

        // allow links clickable within parent tags if set
        if (settings.allowParentLinks && settings.nestedParentLinks) {
            $('.' + prefix + '_item a').click(function (e) {
                e.stopImmediatePropagation();
            });
        }
    };

    //toggle menu
    Plugin.prototype._menuToggle = function (el) {
        var $this = this;
        var btn = $this.btn;
        var mobileNav = $this.mobileNav;

        if (btn.hasClass(prefix + '_collapsed')) {
            btn.removeClass(prefix + '_collapsed');
            btn.addClass(prefix + '_open');
        } else {
            btn.removeClass(prefix + '_open');
            btn.addClass(prefix + '_collapsed');
        }
        btn.addClass(prefix + '_animating');
        $this._visibilityToggle(mobileNav, btn.parent(), true, btn);
    };

    // toggle clicked items
    Plugin.prototype._itemClick = function (el) {
        var $this = this;
        var settings = $this.settings;
        var data = el.data('menu');
        if (!data) {
            data = {};
            data.arrow = el.children('.' + prefix + '_arrow');
            data.ul = el.next('ul');
            data.parent = el.parent();
            //Separated parent link structure
            if (data.parent.hasClass(prefix + '_parent-link')) {
                data.parent = el.parent().parent();
                data.ul = el.parent().next('ul');
            }
            el.data('menu', data);
        }
        if (data.parent.hasClass(prefix + '_collapsed')) {
            data.arrow.html(settings.openedSymbol);
            data.parent.removeClass(prefix + '_collapsed');
            data.parent.addClass(prefix + '_open');
            data.parent.addClass(prefix + '_animating');
            $this._visibilityToggle(data.ul, data.parent, true, el);
        } else {
            data.arrow.html(settings.closedSymbol);
            data.parent.addClass(prefix + '_collapsed');
            data.parent.removeClass(prefix + '_open');
            data.parent.addClass(prefix + '_animating');
            $this._visibilityToggle(data.ul, data.parent, true, el);
        }
    };

    // toggle actual visibility and accessibility tags
    Plugin.prototype._visibilityToggle = function (
        el,
        parent,
        animate,
        trigger,
        init
    ) {
        var $this = this;
        var settings = $this.settings;
        var items = $this._getActionItems(el);
        var duration = 0;
        if (animate) {
            duration = settings.duration;
        }

        if (el.hasClass(prefix + '_hidden')) {
            el.removeClass(prefix + '_hidden');
            //Fire beforeOpen callback
            if (!init) {
                settings.beforeOpen(trigger);
            }
            el.slideDown(duration, settings.easingOpen, function () {
                $(trigger).removeClass(prefix + '_animating');
                $(parent).removeClass(prefix + '_animating');

                //Fire afterOpen callback
                if (!init) {
                    settings.afterOpen(trigger);
                }
            });
            el.attr('aria-hidden', 'false');
            items.attr('tabindex', '0');
            $this._setVisAttr(el, false);
        } else {
            el.addClass(prefix + '_hidden');

            //Fire init or beforeClose callback
            if (!init) {
                settings.beforeClose(trigger);
            }

            el.slideUp(duration, this.settings.easingClose, function () {
                el.attr('aria-hidden', 'true');
                items.attr('tabindex', '-1');
                $this._setVisAttr(el, true);
                el.hide(); //jQuery 1.7 bug fix

                $(trigger).removeClass(prefix + '_animating');
                $(parent).removeClass(prefix + '_animating');

                //Fire init or afterClose callback
                if (!init) {
                    settings.afterClose(trigger);
                } else if (trigger == 'init') {
                    settings.init();
                }
            });
        }
    };

    // set attributes of element and children based on visibility
    Plugin.prototype._setVisAttr = function (el, hidden) {
        var $this = this;

        // select all parents that aren't hidden
        var nonHidden = el
            .children('li')
            .children('ul')
            .not('.' + prefix + '_hidden');

        // iterate over all items setting appropriate tags
        if (!hidden) {
            nonHidden.each(function () {
                var ul = $(this);
                ul.attr('aria-hidden', 'false');
                var items = $this._getActionItems(ul);
                items.attr('tabindex', '0');
                $this._setVisAttr(ul, hidden);
            });
        } else {
            nonHidden.each(function () {
                var ul = $(this);
                ul.attr('aria-hidden', 'true');
                var items = $this._getActionItems(ul);
                items.attr('tabindex', '-1');
                $this._setVisAttr(ul, hidden);
            });
        }
    };

    // get all 1st level items that are clickable
    Plugin.prototype._getActionItems = function (el) {
        var data = el.data('menu');
        if (!data) {
            data = {};
            var items = el.children('li');
            var anchors = items.find('a');
            data.links = anchors.add(items.find('.' + prefix + '_item'));
            el.data('menu', data);
        }
        return data.links;
    };

    Plugin.prototype._outlines = function (state) {
        if (!state) {
            $('.' + prefix + '_item, .' + prefix + '_btn').css(
                'outline',
                'none'
            );
        } else {
            $('.' + prefix + '_item, .' + prefix + '_btn').css('outline', '');
        }
    };

    Plugin.prototype.toggle = function () {
        var $this = this;
        $this._menuToggle();
    };

    Plugin.prototype.open = function () {
        var $this = this;
        if ($this.btn.hasClass(prefix + '_collapsed')) {
            $this._menuToggle();
        }
    };

    Plugin.prototype.close = function () {
        var $this = this;
        if ($this.btn.hasClass(prefix + '_open')) {
            $this._menuToggle();
        }
    };

    $.fn[mobileMenu] = function (options) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted, instantiate a new instance
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                // Only allow the plugin to be instantiated once due to methods
                if (!$.data(this, 'plugin_' + mobileMenu)) {
                    // if it has no instance, create a new one, pass options to our plugin constructor,
                    // and store the plugin instance in the elements jQuery data object.
                    $.data(
                        this,
                        'plugin_' + mobileMenu,
                        new Plugin(this, options)
                    );
                }
            });

            // If is a string and doesn't start with an underscore or 'init' function, treat this as a call to a public method.
        } else if (
            typeof options === 'string' &&
            options[0] !== '_' &&
            options !== 'init'
        ) {
            // Cache the method call to make it possible to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + mobileMenu);

                // Tests that there's already a plugin-instance and checks that the requested public method exists
                if (
                    instance instanceof Plugin &&
                    typeof instance[options] === 'function'
                ) {
                    // Call the method of our plugin instance, and pass it the supplied arguments.
                    returns = instance[options].apply(
                        instance,
                        Array.prototype.slice.call(args, 1)
                    );
                }
            });

            // If the earlier cached method gives a value back return the value, otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, document, window);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function () {
        var instanceUid = 0;

        function Slick(element, settings) {
            var _ = this,
                dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow:
                    '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow:
                    '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '$spacing-med',
                cssEase: 'ease',
                customPaging: function (slider, i) {
                    return $(
                        '<button type="button" data-role="none" role="button" tabindex="0" />'
                    ).text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000,
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false,
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

            _.registerBreakpoints();
            _.init(true);
        }

        return Slick;
    })();

    Slick.prototype.activateADA = function () {
        var _ = this;

        _.$slideTrack
            .find('.slick-active')
            .attr({
                'aria-hidden': 'false',
            })
            .find('a, input, button, select')
            .attr({
                tabindex: '0',
            });
    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (
        markup,
        index,
        addBefore
    ) {
        var _ = this;

        if (typeof index === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || index >= _.slideCount) {
            return false;
        }

        _.unload();

        if (typeof index === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.animateHeight = function () {
        var _ = this;
        if (
            _.options.slidesToShow === 1 &&
            _.options.adaptiveHeight === true &&
            _.options.vertical === false
        ) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate(
                {
                    height: targetHeight,
                },
                _.options.speed
            );
        }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {
        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate(
                    {
                        left: targetLeft,
                    },
                    _.options.speed,
                    _.options.easing,
                    callback
                );
            } else {
                _.$slideTrack.animate(
                    {
                        top: targetLeft,
                    },
                    _.options.speed,
                    _.options.easing,
                    callback
                );
            }
        } else {
            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -_.currentLeft;
                }
                $({
                    animStart: _.currentLeft,
                }).animate(
                    {
                        animStart: targetLeft,
                    },
                    {
                        duration: _.options.speed,
                        easing: _.options.easing,
                        step: function (now) {
                            now = Math.ceil(now);
                            if (_.options.vertical === false) {
                                animProps[_.animType] =
                                    'translate(' + now + 'px, 0px)';
                                _.$slideTrack.css(animProps);
                            } else {
                                animProps[_.animType] =
                                    'translate(0px,' + now + 'px)';
                                _.$slideTrack.css(animProps);
                            }
                        },
                        complete: function () {
                            if (callback) {
                                callback.call();
                            }
                        },
                    }
                );
            } else {
                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] =
                        'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] =
                        'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function () {
                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }
            }
        }
    };

    Slick.prototype.getNavTarget = function () {
        var _ = this,
            asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;
    };

    Slick.prototype.asNavFor = function (index) {
        var _ = this,
            asNavFor = _.getNavTarget();

        if (asNavFor !== null && typeof asNavFor === 'object') {
            asNavFor.each(function () {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }
    };

    Slick.prototype.applyTransition = function (slide) {
        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] =
                _.transformType +
                ' ' +
                _.options.speed +
                'ms ' +
                _.options.cssEase;
        } else {
            transition[_.transitionType] =
                'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.autoPlay = function () {
        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(
                _.autoPlayIterator,
                _.options.autoplaySpeed
            );
        }
    };

    Slick.prototype.autoPlayClear = function () {
        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
    };

    Slick.prototype.autoPlayIterator = function () {
        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {
            if (_.options.infinite === false) {
                if (
                    _.direction === 1 &&
                    _.currentSlide + 1 === _.slideCount - 1
                ) {
                    _.direction = 0;
                } else if (_.direction === 0) {
                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }
                }
            }

            _.slideHandler(slideTo);
        }
    };

    Slick.prototype.buildArrows = function () {
        var _ = this;

        if (_.options.arrows === true) {
            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {
                _.$prevArrow
                    .removeClass('slick-hidden')
                    .removeAttr('aria-hidden tabindex');
                _.$nextArrow
                    .removeClass('slick-hidden')
                    .removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }
            } else {
                _.$prevArrow
                    .add(_.$nextArrow)

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        tabindex: '-1',
                    });
            }
        }
    };

    Slick.prototype.buildDots = function () {
        var _ = this,
            i,
            dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append(
                    $('<li />').append(_.options.customPaging.call(this, _, i))
                );
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots
                .find('li')
                .first()
                .addClass('slick-active')
                .attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.buildOut = function () {
        var _ = this;

        _.$slides = _.$slider
            .children(_.options.slide + ':not(.slick-cloned)')
            .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function (index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack =
            _.slideCount === 0
                ? $('<div class="slick-track"/>').appendTo(_.$slider)
                : _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack
            .wrap('<div aria-live="polite" class="slick-list"/>')
            .parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();

        _.setSlideClasses(
            typeof _.currentSlide === 'number' ? _.currentSlide : 0
        );

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }
    };

    Slick.prototype.buildRows = function () {
        var _ = this,
            a,
            b,
            c,
            newSlides,
            numOfSlides,
            originalSlides,
            slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 1) {
            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target =
                            a * slidesPerSection +
                            (b * _.options.slidesPerRow + c);
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider
                .children()
                .children()
                .children()
                .css({
                    width: 100 / _.options.slidesPerRow + '%',
                    display: 'inline-block',
                });
        }
    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {
        var _ = this,
            breakpoint,
            targetBreakpoint,
            respondToWidth,
            triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (
            _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null
        ) {
            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (
                        targetBreakpoint !== _.activeBreakpoint ||
                        forceUpdate
                    ) {
                        _.activeBreakpoint = targetBreakpoint;
                        if (
                            _.breakpointSettings[targetBreakpoint] === 'unslick'
                        ) {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend(
                                {},
                                _.originalSettings,
                                _.breakpointSettings[targetBreakpoint]
                            );
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend(
                            {},
                            _.originalSettings,
                            _.breakpointSettings[targetBreakpoint]
                        );
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }
    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {
        var _ = this,
            $target = $(event.currentTarget),
            indexOffset,
            slideOffset,
            unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
        indexOffset = unevenOffset
            ? 0
            : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {
            case 'previous':
                slideOffset =
                    indexOffset === 0
                        ? _.options.slidesToScroll
                        : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(
                        _.currentSlide - slideOffset,
                        false,
                        dontAnimate
                    );
                }
                break;

            case 'next':
                slideOffset =
                    indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(
                        _.currentSlide + slideOffset,
                        false,
                        dontAnimate
                    );
                }
                break;

            case 'index':
                var index =
                    event.data.index === 0
                        ? 0
                        : event.data.index ||
                          $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }
    };

    Slick.prototype.checkNavigable = function (index) {
        var _ = this,
            navigables,
            prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function () {
        var _ = this;

        if (_.options.dots && _.$dots !== null) {
            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }

        _.$slider.off('focus.slick blur.slick');

        if (
            _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow
        ) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off(
            'orientationchange.slick.slick-' + _.instanceUid,
            _.orientationChange
        );

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off(
            'dragstart',
            _.preventDefault
        );

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpSlideEvents = function () {
        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
    };

    Slick.prototype.cleanUpRows = function () {
        var _ = this,
            originalSlides;

        if (_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }
    };

    Slick.prototype.clickHandler = function (event) {
        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
    };

    Slick.prototype.destroy = function (refresh) {
        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.$prevArrow.length) {
            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {
            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }
        }

        if (_.$slides) {
            _.$slides
                .removeClass(
                    'slick-slide slick-active slick-center slick-visible slick-current'
                )
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function () {
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }
    };

    Slick.prototype.disableTransition = function (slide) {
        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {
        var _ = this;

        if (_.cssTransitions === false) {
            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex,
            });

            _.$slides.eq(slideIndex).animate(
                {
                    opacity: 1,
                },
                _.options.speed,
                _.options.easing,
                callback
            );
        } else {
            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex,
            });

            if (callback) {
                setTimeout(function () {
                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }
        }
    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {
        var _ = this;

        if (_.cssTransitions === false) {
            _.$slides.eq(slideIndex).animate(
                {
                    opacity: 0,
                    zIndex: _.options.zIndex - 2,
                },
                _.options.speed,
                _.options.easing
            );
        } else {
            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2,
            });
        }
    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (
        filter
    ) {
        var _ = this;

        if (filter !== null) {
            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.focusHandler = function () {
        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on(
                'focus.slick blur.slick',
                '*:not(.slick-arrow)',
                function (event) {
                    event.stopImmediatePropagation();
                    var $sf = $(this);

                    setTimeout(function () {
                        if (_.options.pauseOnFocus) {
                            _.focussed = $sf.is(':focus');
                            _.autoPlay();
                        }
                    }, 0);
                }
            );
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide =
        function () {
            var _ = this;
            return _.currentSlide;
        };

    Slick.prototype.getDotCount = function () {
        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter +=
                    _.options.slidesToScroll <= _.options.slidesToShow
                        ? _.options.slidesToScroll
                        : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty =
                1 +
                Math.ceil(
                    (_.slideCount - _.options.slidesToShow) /
                        _.options.slidesToScroll
                );
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter +=
                    _.options.slidesToScroll <= _.options.slidesToShow
                        ? _.options.slidesToScroll
                        : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;
    };

    Slick.prototype.getLeft = function (slideIndex) {
        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
                verticalOffset = verticalHeight * _.options.slidesToShow * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (
                    slideIndex + _.options.slidesToScroll > _.slideCount &&
                    _.slideCount > _.options.slidesToShow
                ) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset =
                            (_.options.slidesToShow -
                                (slideIndex - _.slideCount)) *
                            _.slideWidth *
                            -1;
                        verticalOffset =
                            (_.options.slidesToShow -
                                (slideIndex - _.slideCount)) *
                            verticalHeight *
                            -1;
                    } else {
                        _.slideOffset =
                            (_.slideCount % _.options.slidesToScroll) *
                            _.slideWidth *
                            -1;
                        verticalOffset =
                            (_.slideCount % _.options.slidesToScroll) *
                            verticalHeight *
                            -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset =
                    (slideIndex + _.options.slidesToShow - _.slideCount) *
                    _.slideWidth;
                verticalOffset =
                    (slideIndex + _.options.slidesToShow - _.slideCount) *
                    verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset +=
                _.slideWidth * Math.floor(_.options.slidesToShow / 2) -
                _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset +=
                _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
        } else {
            targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
        }

        if (_.options.variableWidth === true) {
            if (
                _.slideCount <= _.options.slidesToShow ||
                _.options.infinite === false
            ) {
                targetSlide = _.$slideTrack
                    .children('.slick-slide')
                    .eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack
                    .children('.slick-slide')
                    .eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft =
                        (_.$slideTrack.width() -
                            targetSlide[0].offsetLeft -
                            targetSlide.width()) *
                        -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0]
                    ? targetSlide[0].offsetLeft * -1
                    : 0;
            }

            if (_.options.centerMode === true) {
                if (
                    _.slideCount <= _.options.slidesToShow ||
                    _.options.infinite === false
                ) {
                    targetSlide = _.$slideTrack
                        .children('.slick-slide')
                        .eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack
                        .children('.slick-slide')
                        .eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft =
                            (_.$slideTrack.width() -
                                targetSlide[0].offsetLeft -
                                targetSlide.width()) *
                            -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0]
                        ? targetSlide[0].offsetLeft * -1
                        : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;
    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (
        option
    ) {
        var _ = this;

        return _.options[option];
    };

    Slick.prototype.getNavigableIndexes = function () {
        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter +=
                _.options.slidesToScroll <= _.options.slidesToShow
                    ? _.options.slidesToScroll
                    : _.options.slidesToShow;
        }

        return indexes;
    };

    Slick.prototype.getSlick = function () {
        return this;
    };

    Slick.prototype.getSlideCount = function () {
        var _ = this,
            slidesTraversed,
            swipedSlide,
            centerOffset;

        centerOffset =
            _.options.centerMode === true
                ? _.slideWidth * Math.floor(_.options.slidesToShow / 2)
                : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function (index, slide) {
                if (
                    slide.offsetLeft -
                        centerOffset +
                        $(slide).outerWidth() / 2 >
                    _.swipeLeft * -1
                ) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed =
                Math.abs(
                    $(swipedSlide).attr('data-slick-index') - _.currentSlide
                ) || 1;

            return slidesTraversed;
        } else {
            return _.options.slidesToScroll;
        }
    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (
        slide,
        dontAnimate
    ) {
        var _ = this;

        _.changeSlide(
            {
                data: {
                    message: 'index',
                    index: parseInt(slide),
                },
            },
            dontAnimate
        );
    };

    Slick.prototype.init = function (creation) {
        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {
            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();
        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if (_.options.autoplay) {
            _.paused = false;
            _.autoPlay();
        }
    };

    Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides
            .add(_.$slideTrack.find('.slick-cloned'))
            .attr({
                'aria-hidden': 'true',
                tabindex: '-1',
            })
            .find('a, input, button, select')
            .attr({
                tabindex: '-1',
            });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
            $(this).attr({
                role: 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + '',
            });
        });

        if (_.$dots !== null) {
            _.$dots
                .attr('role', 'tablist')
                .find('li')
                .each(function (i) {
                    $(this).attr({
                        role: 'presentation',
                        'aria-selected': 'false',
                        'aria-controls': 'navigation' + _.instanceUid + i + '',
                        id: 'slick-slide' + _.instanceUid + i + '',
                    });
                })
                .first()
                .attr('aria-selected', 'true')
                .end()
                .find('button')
                .attr('role', 'button')
                .end()
                .closest('div')
                .attr('role', 'toolbar');
        }
        _.activateADA();
    };

    Slick.prototype.initArrowEvents = function () {
        var _ = this;

        if (
            _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow
        ) {
            _.$prevArrow.off('click.slick').on(
                'click.slick',
                {
                    message: 'previous',
                },
                _.changeSlide
            );
            _.$nextArrow.off('click.slick').on(
                'click.slick',
                {
                    message: 'next',
                },
                _.changeSlide
            );
        }
    };

    Slick.prototype.initDotEvents = function () {
        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on(
                'click.slick',
                {
                    message: 'index',
                },
                _.changeSlide
            );
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true) {
            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initSlideEvents = function () {
        var _ = this;

        if (_.options.pauseOnHover) {
            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initializeEvents = function () {
        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on(
            'touchstart.slick mousedown.slick',
            {
                action: 'start',
            },
            _.swipeHandler
        );
        _.$list.on(
            'touchmove.slick mousemove.slick',
            {
                action: 'move',
            },
            _.swipeHandler
        );
        _.$list.on(
            'touchend.slick mouseup.slick',
            {
                action: 'end',
            },
            _.swipeHandler
        );
        _.$list.on(
            'touchcancel.slick mouseleave.slick',
            {
                action: 'end',
            },
            _.swipeHandler
        );

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on(
            'orientationchange.slick.slick-' + _.instanceUid,
            $.proxy(_.orientationChange, _)
        );

        $(window).on(
            'resize.slick.slick-' + _.instanceUid,
            $.proxy(_.resize, _)
        );

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.initUI = function () {
        var _ = this;

        if (
            _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow
        ) {
            _.$prevArrow.show();
            _.$nextArrow.show();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            _.$dots.show();
        }
    };

    Slick.prototype.keyHandler = function (event) {
        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' : 'previous',
                    },
                });
            } else if (
                event.keyCode === 39 &&
                _.options.accessibility === true
            ) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next',
                    },
                });
            }
        }
    };

    Slick.prototype.lazyLoad = function () {
        var _ = this,
            loadRange,
            cloneRange,
            rangeStart,
            rangeEnd;

        function loadImages(imagesScope) {
            $('img[data-lazy]', imagesScope).each(function () {
                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function () {
                    image.animate({ opacity: 0 }, 100, function () {
                        image
                            .attr('src', imageSource)
                            .animate({ opacity: 1 }, 200, function () {
                                image
                                    .removeAttr('data-lazy')
                                    .removeClass('slick-loading');
                            });
                        _.$slider.trigger('lazyLoaded', [
                            _,
                            image,
                            imageSource,
                        ]);
                    });
                };

                imageToLoad.onerror = function () {
                    image
                        .removeAttr('data-lazy')
                        .removeClass('slick-loading')
                        .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
                };

                imageToLoad.src = imageSource;
            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(
                    0,
                    _.currentSlide - (_.options.slidesToShow / 2 + 1)
                );
                rangeEnd =
                    2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite
                ? _.options.slidesToShow + _.currentSlide
                : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider
                .find('.slick-cloned')
                .slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider
                .find('.slick-cloned')
                .slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }
    };

    Slick.prototype.loadSlider = function () {
        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1,
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }
    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {
        var _ = this;

        _.changeSlide({
            data: {
                message: 'next',
            },
        });
    };

    Slick.prototype.orientationChange = function () {
        var _ = this;

        _.checkResponsive();
        _.setPosition();
    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {
        var _ = this;

        _.autoPlayClear();
        _.paused = true;
    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {
        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;
    };

    Slick.prototype.postSlide = function (index) {
        var _ = this;

        if (!_.unslicked) {
            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }
        }
    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {
        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous',
            },
        });
    };

    Slick.prototype.preventDefault = function (event) {
        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {
        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $('img[data-lazy]', _.$slider),
            image,
            imageSource,
            imageToLoad;

        if ($imgsToLoad.length) {
            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function () {
                image
                    .attr('src', imageSource)
                    .removeAttr('data-lazy')
                    .removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();
            };

            imageToLoad.onerror = function () {
                if (tryCount < 3) {
                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function () {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);
                } else {
                    image
                        .removeAttr('data-lazy')
                        .removeClass('slick-loading')
                        .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();
                }
            };

            imageToLoad.src = imageSource;
        } else {
            _.$slider.trigger('allImagesLoaded', [_]);
        }
    };

    Slick.prototype.refresh = function (initializing) {
        var _ = this,
            currentSlide,
            lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if (!initializing) {
            _.changeSlide(
                {
                    data: {
                        message: 'index',
                        index: currentSlide,
                    },
                },
                false
            );
        }
    };

    Slick.prototype.registerBreakpoints = function () {
        var _ = this,
            breakpoint,
            currentBreakpoint,
            l,
            responsiveSettings = _.options.responsive || null;

        if (
            $.type(responsiveSettings) === 'array' &&
            responsiveSettings.length
        ) {
            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {
                l = _.breakpoints.length - 1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (
                            _.breakpoints[l] &&
                            _.breakpoints[l] === currentBreakpoint
                        ) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] =
                        responsiveSettings[breakpoint].settings;
                }
            }

            _.breakpoints.sort(function (a, b) {
                return _.options.mobileFirst ? a - b : b - a;
            });
        }
    };

    Slick.prototype.reinit = function () {
        var _ = this;

        _.$slides = _.$slideTrack
            .children(_.options.slide)
            .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(
            typeof _.currentSlide === 'number' ? _.currentSlide : 0
        );

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);
    };

    Slick.prototype.resize = function () {
        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function () {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
        index,
        removeBefore,
        removeAll
    ) {
        var _ = this;

        if (typeof index === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.setCSS = function (position) {
        var _ = this,
            positionProps = {},
            x,
            y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] =
                    'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }
    };

    Slick.prototype.setDimensions = function () {
        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: '0px ' + _.options.centerPadding,
                });
            }
        } else {
            _.$list.height(
                _.$slides.first().outerHeight(true) * _.options.slidesToShow
            );
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: _.options.centerPadding + ' 0px',
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();

        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(
                Math.ceil(
                    _.slideWidth * _.$slideTrack.children('.slick-slide').length
                )
            );
        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(
                Math.ceil(
                    _.$slides.first().outerHeight(true) *
                        _.$slideTrack.children('.slick-slide').length
                )
            );
        }

        var offset =
            _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false)
            _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };

    Slick.prototype.setFade = function () {
        var _ = this,
            targetLeft;

        _.$slides.each(function (index, element) {
            targetLeft = _.slideWidth * index * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0,
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0,
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1,
        });
    };

    Slick.prototype.setHeight = function () {
        var _ = this;

        if (
            _.options.slidesToShow === 1 &&
            _.options.adaptiveHeight === true &&
            _.options.vertical === false
        ) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }
    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this,
            l,
            item,
            option,
            value,
            refresh = false,
            type;

        if ($.type(arguments[0]) === 'object') {
            option = arguments[0];
            refresh = arguments[1];
            type = 'multiple';
        } else if ($.type(arguments[0]) === 'string') {
            option = arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if (
                arguments[0] === 'responsive' &&
                $.type(arguments[1]) === 'array'
            ) {
                type = 'responsive';
            } else if (typeof arguments[1] !== 'undefined') {
                type = 'single';
            }
        }

        if (type === 'single') {
            _.options[option] = value;
        } else if (type === 'multiple') {
            $.each(option, function (opt, val) {
                _.options[opt] = val;
            });
        } else if (type === 'responsive') {
            for (item in value) {
                if ($.type(_.options.responsive) !== 'array') {
                    _.options.responsive = [value[item]];
                } else {
                    l = _.options.responsive.length - 1;

                    // loop through the responsive object and splice out duplicates.
                    while (l >= 0) {
                        if (
                            _.options.responsive[l].breakpoint ===
                            value[item].breakpoint
                        ) {
                            _.options.responsive.splice(l, 1);
                        }

                        l--;
                    }

                    _.options.responsive.push(value[item]);
                }
            }
        }

        if (refresh) {
            _.unload();
            _.reinit();
        }
    };

    Slick.prototype.setPosition = function () {
        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);
    };

    Slick.prototype.setProps = function () {
        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (
            bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined
        ) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (
                bodyStyle.perspectiveProperty === undefined &&
                bodyStyle.webkitPerspective === undefined
            )
                _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (
                bodyStyle.perspectiveProperty === undefined &&
                bodyStyle.MozPerspective === undefined
            )
                _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (
                bodyStyle.perspectiveProperty === undefined &&
                bodyStyle.webkitPerspective === undefined
            )
                _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled =
            _.options.useTransform &&
            _.animType !== null &&
            _.animType !== false;
    };

    Slick.prototype.setSlideClasses = function (index) {
        var _ = this,
            centerOffset,
            allSlides,
            indexOffset,
            remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides.eq(index).addClass('slick-current');

        if (_.options.centerMode === true) {
            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {
                if (
                    index >= centerOffset &&
                    index <= _.slideCount - 1 - centerOffset
                ) {
                    _.$slides
                        .slice(index - centerOffset, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');
                } else {
                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(
                            indexOffset - centerOffset + 1,
                            indexOffset + centerOffset + 2
                        )
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');
                }

                if (index === 0) {
                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');
                } else if (index === _.slideCount - 1) {
                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');
                }
            }

            _.$slides.eq(index).addClass('slick-center');
        } else {
            if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');
            } else if (allSlides.length <= _.options.slidesToShow) {
                allSlides.addClass('slick-active').attr('aria-hidden', 'false');
            } else {
                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset =
                    _.options.infinite === true
                        ? _.options.slidesToShow + index
                        : index;

                if (
                    _.options.slidesToShow == _.options.slidesToScroll &&
                    _.slideCount - index < _.options.slidesToShow
                ) {
                    allSlides
                        .slice(
                            indexOffset - (_.options.slidesToShow - remainder),
                            indexOffset + remainder
                        )
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');
                } else {
                    allSlides
                        .slice(
                            indexOffset,
                            indexOffset + _.options.slidesToShow
                        )
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');
                }
            }
        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function () {
        var _ = this,
            i,
            slideIndex,
            infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {
            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {
                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (
                    i = _.slideCount;
                    i > _.slideCount - infiniteCount;
                    i -= 1
                ) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex])
                        .clone(true)
                        .attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack)
                        .addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex])
                        .clone(true)
                        .attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack)
                        .addClass('slick-cloned');
                }
                _.$slideTrack
                    .find('.slick-cloned')
                    .find('[id]')
                    .each(function () {
                        $(this).attr('id', '');
                    });
            }
        }
    };

    Slick.prototype.interrupt = function (toggle) {
        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;
    };

    Slick.prototype.selectHandler = function (event) {
        var _ = this;

        var targetElement = $(event.target).is('.slick-slide')
            ? $(event.target)
            : $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {
            _.setSlideClasses(index);
            _.asNavFor(index);
            return;
        }

        _.slideHandler(index);
    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
        var targetSlide,
            animSlide,
            oldSlide,
            slideLeft,
            targetLeft = null,
            _ = this,
            navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (
            _.options.infinite === false &&
            _.options.centerMode === false &&
            (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
        ) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (
            _.options.infinite === false &&
            _.options.centerMode === true &&
            (index < 0 || index > _.slideCount - _.options.slidesToScroll)
        ) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide =
                    _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {
            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }
        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {
                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function () {
                    _.postSlide(animSlide);
                });
            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function () {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }
    };

    Slick.prototype.startLoad = function () {
        var _ = this;

        if (
            _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow
        ) {
            _.$prevArrow.hide();
            _.$nextArrow.hide();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            _.$dots.hide();
        }

        _.$slider.addClass('slick-loading');
    };

    Slick.prototype.swipeDirection = function () {
        var xDist,
            yDist,
            r,
            swipeAngle,
            _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round((r * 180) / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle <= 360 && swipeAngle >= 315) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return _.options.rtl === false ? 'right' : 'left';
        }
        if (_.options.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';
    };

    Slick.prototype.swipeEnd = function (event) {
        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
            direction = _.swipeDirection();

            switch (direction) {
                case 'left':
                case 'down':
                    slideCount = _.options.swipeToSlide
                        ? _.checkNavigable(_.currentSlide + _.getSlideCount())
                        : _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':
                    slideCount = _.options.swipeToSlide
                        ? _.checkNavigable(_.currentSlide - _.getSlideCount())
                        : _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:
            }

            if (direction != 'vertical') {
                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);
            }
        } else {
            if (_.touchObject.startX !== _.touchObject.curX) {
                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }
    };

    Slick.prototype.swipeHandler = function (event) {
        var _ = this;

        if (
            _.options.swipe === false ||
            ('ontouchend' in document && _.options.swipe === false)
        ) {
            return;
        } else if (
            _.options.draggable === false &&
            event.type.indexOf('mouse') !== -1
        ) {
            return;
        }

        _.touchObject.fingerCount =
            event.originalEvent && event.originalEvent.touches !== undefined
                ? event.originalEvent.touches.length
                : 1;

        _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
        }

        switch (event.data.action) {
            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;
        }
    };

    Slick.prototype.swipeMove = function (event) {
        var _ = this,
            edgeWasHit = false,
            curLeft,
            swipeDirection,
            swipeLength,
            positionOffset,
            touches;

        touches =
            event.originalEvent !== undefined
                ? event.originalEvent.touches
                : null;

        if (!_.dragging || (touches && touches.length !== 1)) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX =
            touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY =
            touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(
            Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))
        );

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(
                Math.sqrt(
                    Math.pow(_.touchObject.curY - _.touchObject.startY, 2)
                )
            );
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (
            event.originalEvent !== undefined &&
            _.touchObject.swipeLength > 4
        ) {
            event.preventDefault();
        }

        positionOffset =
            (_.options.rtl === false ? 1 : -1) *
            (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }

        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if (
                (_.currentSlide === 0 && swipeDirection === 'right') ||
                (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')
            ) {
                swipeLength =
                    _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft =
                curLeft +
                swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);
    };

    Slick.prototype.swipeStart = function (event) {
        var _ = this,
            touches;

        _.interrupted = true;

        if (
            _.touchObject.fingerCount !== 1 ||
            _.slideCount <= _.options.slidesToShow
        ) {
            _.touchObject = {};
            return false;
        }

        if (
            event.originalEvent !== undefined &&
            event.originalEvent.touches !== undefined
        ) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX =
            touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY =
            touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;
    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter =
        function () {
            var _ = this;

            if (_.$slidesCache !== null) {
                _.unload();

                _.$slideTrack.children(this.options.slide).detach();

                _.$slidesCache.appendTo(_.$slideTrack);

                _.reinit();
            }
        };

    Slick.prototype.unload = function () {
        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');
    };

    Slick.prototype.unslick = function (fromBreakpoint) {
        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();
    };

    Slick.prototype.updateArrows = function () {
        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (
            _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite
        ) {
            _.$prevArrow
                .removeClass('slick-disabled')
                .attr('aria-disabled', 'false');
            _.$nextArrow
                .removeClass('slick-disabled')
                .attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {
                _.$prevArrow
                    .addClass('slick-disabled')
                    .attr('aria-disabled', 'true');
                _.$nextArrow
                    .removeClass('slick-disabled')
                    .attr('aria-disabled', 'false');
            } else if (
                _.currentSlide >= _.slideCount - _.options.slidesToShow &&
                _.options.centerMode === false
            ) {
                _.$nextArrow
                    .addClass('slick-disabled')
                    .attr('aria-disabled', 'true');
                _.$prevArrow
                    .removeClass('slick-disabled')
                    .attr('aria-disabled', 'false');
            } else if (
                _.currentSlide >= _.slideCount - 1 &&
                _.options.centerMode === true
            ) {
                _.$nextArrow
                    .addClass('slick-disabled')
                    .attr('aria-disabled', 'true');
                _.$prevArrow
                    .removeClass('slick-disabled')
                    .attr('aria-disabled', 'false');
            }
        }
    };

    Slick.prototype.updateDots = function () {
        var _ = this;

        if (_.$dots !== null) {
            _.$dots
                .find('li')
                .removeClass('slick-active')
                .attr('aria-hidden', 'true');

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.visibility = function () {
        var _ = this;

        if (_.options.autoplay) {
            if (document[_.hidden]) {
                _.interrupted = true;
            } else {
                _.interrupted = false;
            }
        }
    };

    $.fn.slick = function () {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
});
/*! Magnific Popup - v1.1.0 - 2016-02-20
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2016 Dmitry Semenov; */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery || window.Zepto);
    }
})(function ($) {
    /*>>core*/
    /**
     *
     * Magnific Popup Core JS file
     *
     */

    /**
     * Private static constants
     */
    var CLOSE_EVENT = 'Close',
        BEFORE_CLOSE_EVENT = 'BeforeClose',
        AFTER_CLOSE_EVENT = 'AfterClose',
        BEFORE_APPEND_EVENT = 'BeforeAppend',
        MARKUP_PARSE_EVENT = 'MarkupParse',
        OPEN_EVENT = 'Open',
        CHANGE_EVENT = 'Change',
        NS = 'mfp',
        EVENT_NS = '.' + NS,
        READY_CLASS = 'mfp-ready',
        REMOVING_CLASS = 'mfp-removing',
        PREVENT_CLOSE_CLASS = 'mfp-prevent-close';

    /**
     * Private vars
     */
    /*jshint -W079 */
    var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
        MagnificPopup = function () {},
        _isJQ = !!window.jQuery,
        _prevStatus,
        _window = $(window),
        _document,
        _prevContentType,
        _wrapClasses,
        _currPopupType;

    /**
     * Private functions
     */
    var _mfpOn = function (name, f) {
            mfp.ev.on(NS + name + EVENT_NS, f);
        },
        _getEl = function (className, appendTo, html, raw) {
            var el = document.createElement('div');
            el.className = 'mfp-' + className;
            if (html) {
                el.innerHTML = html;
            }
            if (!raw) {
                el = $(el);
                if (appendTo) {
                    el.appendTo(appendTo);
                }
            } else if (appendTo) {
                appendTo.appendChild(el);
            }
            return el;
        },
        _mfpTrigger = function (e, data) {
            mfp.ev.triggerHandler(NS + e, data);

            if (mfp.st.callbacks) {
                // converts "mfpEventName" to "eventName" callback and triggers it if it's present
                e = e.charAt(0).toLowerCase() + e.slice(1);
                if (mfp.st.callbacks[e]) {
                    mfp.st.callbacks[e].apply(
                        mfp,
                        $.isArray(data) ? data : [data]
                    );
                }
            }
        },
        _getCloseBtn = function (type) {
            if (type !== _currPopupType || !mfp.currTemplate.closeBtn) {
                mfp.currTemplate.closeBtn = $(
                    mfp.st.closeMarkup.replace('%title%', mfp.st.tClose)
                );
                _currPopupType = type;
            }
            return mfp.currTemplate.closeBtn;
        },
        // Initialize Magnific Popup only when called at least once
        _checkInstance = function () {
            if (!$.magnificPopup.instance) {
                /*jshint -W020 */
                mfp = new MagnificPopup();
                mfp.init();
                $.magnificPopup.instance = mfp;
            }
        },
        // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
        supportsTransitions = function () {
            var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
                v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' for vendor

            if (s['transition'] !== undefined) {
                return true;
            }

            while (v.length) {
                if (v.pop() + 'Transition' in s) {
                    return true;
                }
            }

            return false;
        };

    /**
     * Public functions
     */
    MagnificPopup.prototype = {
        constructor: MagnificPopup,

        /**
         * Initializes Magnific Popup plugin.
         * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
         */
        init: function () {
            var appVersion = navigator.appVersion;
            mfp.isLowIE = mfp.isIE8 =
                document.all && !document.addEventListener;
            mfp.isAndroid = /android/gi.test(appVersion);
            mfp.isIOS = /iphone|ipad|ipod/gi.test(appVersion);
            mfp.supportsTransition = supportsTransitions();

            // We disable fixed positioned lightbox on devices that don't handle it nicely.
            // If you know a better way of detecting this - let me know.
            mfp.probablyMobile =
                mfp.isAndroid ||
                mfp.isIOS ||
                /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(
                    navigator.userAgent
                );
            _document = $(document);

            mfp.popupsCache = {};
        },

        /**
         * Opens popup
         * @param  data [description]
         */
        open: function (data) {
            var i;

            if (data.isObj === false) {
                // convert jQuery collection to array to avoid conflicts later
                mfp.items = data.items.toArray();

                mfp.index = 0;
                var items = data.items,
                    item;
                for (i = 0; i < items.length; i++) {
                    item = items[i];
                    if (item.parsed) {
                        item = item.el[0];
                    }
                    if (item === data.el[0]) {
                        mfp.index = i;
                        break;
                    }
                }
            } else {
                mfp.items = $.isArray(data.items) ? data.items : [data.items];
                mfp.index = data.index || 0;
            }

            // if popup is already opened - we just update the content
            if (mfp.isOpen) {
                mfp.updateItemHTML();
                return;
            }

            mfp.types = [];
            _wrapClasses = '';
            if (data.mainEl && data.mainEl.length) {
                mfp.ev = data.mainEl.eq(0);
            } else {
                mfp.ev = _document;
            }

            if (data.key) {
                if (!mfp.popupsCache[data.key]) {
                    mfp.popupsCache[data.key] = {};
                }
                mfp.currTemplate = mfp.popupsCache[data.key];
            } else {
                mfp.currTemplate = {};
            }

            mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data);
            mfp.fixedContentPos =
                mfp.st.fixedContentPos === 'auto'
                    ? !mfp.probablyMobile
                    : mfp.st.fixedContentPos;

            if (mfp.st.modal) {
                mfp.st.closeOnContentClick = false;
                mfp.st.closeOnBgClick = false;
                mfp.st.showCloseBtn = false;
                mfp.st.enableEscapeKey = false;
            }

            // Building markup
            // main containers are created only once
            if (!mfp.bgOverlay) {
                // Dark overlay
                mfp.bgOverlay = _getEl('bg').on(
                    'click' + EVENT_NS,
                    function () {
                        mfp.close();
                    }
                );

                mfp.wrap = _getEl('wrap')
                    .attr('tabindex', -1)
                    .on('click' + EVENT_NS, function (e) {
                        if (mfp._checkIfClose(e.target)) {
                            mfp.close();
                        }
                    });

                mfp.container = _getEl('container', mfp.wrap);
            }

            mfp.contentContainer = _getEl('content');
            if (mfp.st.preloader) {
                mfp.preloader = _getEl(
                    'preloader',
                    mfp.container,
                    mfp.st.tLoading
                );
            }

            // Initializing modules
            var modules = $.magnificPopup.modules;
            for (i = 0; i < modules.length; i++) {
                var n = modules[i];
                n = n.charAt(0).toUpperCase() + n.slice(1);
                mfp['init' + n].call(mfp);
            }
            _mfpTrigger('BeforeOpen');

            if (mfp.st.showCloseBtn) {
                // Close button
                if (!mfp.st.closeBtnInside) {
                    mfp.wrap.append(_getCloseBtn());
                } else {
                    _mfpOn(
                        MARKUP_PARSE_EVENT,
                        function (e, template, values, item) {
                            values.close_replaceWith = _getCloseBtn(item.type);
                        }
                    );
                    _wrapClasses += ' mfp-close-btn-in';
                }
            }

            if (mfp.st.alignTop) {
                _wrapClasses += ' mfp-align-top';
            }

            if (mfp.fixedContentPos) {
                mfp.wrap.css({
                    overflow: mfp.st.overflowY,
                    overflowX: 'hidden',
                    overflowY: mfp.st.overflowY,
                });
            } else {
                mfp.wrap.css({
                    top: _window.scrollTop(),
                    position: 'absolute',
                });
            }
            if (
                mfp.st.fixedBgPos === false ||
                (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos)
            ) {
                mfp.bgOverlay.css({
                    height: _document.height(),
                    position: 'absolute',
                });
            }

            if (mfp.st.enableEscapeKey) {
                // Close on ESC key
                _document.on('keyup' + EVENT_NS, function (e) {
                    if (e.keyCode === 27) {
                        mfp.close();
                    }
                });
            }

            _window.on('resize' + EVENT_NS, function () {
                mfp.updateSize();
            });

            if (!mfp.st.closeOnContentClick) {
                _wrapClasses += ' mfp-auto-cursor';
            }

            if (_wrapClasses) mfp.wrap.addClass(_wrapClasses);

            // this triggers recalculation of layout, so we get it once to not to trigger twice
            var windowHeight = (mfp.wH = _window.height());

            var windowStyles = {};

            if (mfp.fixedContentPos) {
                if (mfp._hasScrollBar(windowHeight)) {
                    var s = mfp._getScrollbarSize();
                    if (s) {
                        windowStyles.marginRight = s;
                    }
                }
            }

            if (mfp.fixedContentPos) {
                if (!mfp.isIE7) {
                    windowStyles.overflow = 'hidden';
                } else {
                    // ie7 double-scroll bug
                    $('body, html').css('overflow', 'hidden');
                }
            }

            var classesToadd = mfp.st.mainClass;
            if (mfp.isIE7) {
                classesToadd += ' mfp-ie7';
            }
            if (classesToadd) {
                mfp._addClassToMFP(classesToadd);
            }

            // add content
            mfp.updateItemHTML();

            _mfpTrigger('BuildControls');

            // remove scrollbar, add margin e.t.c
            $('html').css(windowStyles);

            // add everything to DOM
            mfp.bgOverlay
                .add(mfp.wrap)
                .prependTo(mfp.st.prependTo || $(document.body));

            // Save last focused element
            mfp._lastFocusedEl = document.activeElement;

            // Wait for next cycle to allow CSS transition
            setTimeout(function () {
                if (mfp.content) {
                    mfp._addClassToMFP(READY_CLASS);
                    mfp._setFocus();
                } else {
                    // if content is not defined (not loaded e.t.c) we add class only for BG
                    mfp.bgOverlay.addClass(READY_CLASS);
                }

                // Trap the focus in popup
                _document.on('focusin' + EVENT_NS, mfp._onFocusIn);
            }, 16);

            mfp.isOpen = true;
            mfp.updateSize(windowHeight);
            _mfpTrigger(OPEN_EVENT);

            return data;
        },

        /**
         * Closes the popup
         */
        close: function () {
            if (!mfp.isOpen) return;
            _mfpTrigger(BEFORE_CLOSE_EVENT);

            mfp.isOpen = false;
            // for CSS3 animation
            if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) {
                mfp._addClassToMFP(REMOVING_CLASS);
                setTimeout(function () {
                    mfp._close();
                }, mfp.st.removalDelay);
            } else {
                mfp._close();
            }
        },

        /**
         * Helper for close() function
         */
        _close: function () {
            _mfpTrigger(CLOSE_EVENT);

            var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

            mfp.bgOverlay.detach();
            mfp.wrap.detach();
            mfp.container.empty();

            if (mfp.st.mainClass) {
                classesToRemove += mfp.st.mainClass + ' ';
            }

            mfp._removeClassFromMFP(classesToRemove);

            if (mfp.fixedContentPos) {
                var windowStyles = { marginRight: '' };
                if (mfp.isIE7) {
                    $('body, html').css('overflow', '');
                } else {
                    windowStyles.overflow = '';
                }
                $('html').css(windowStyles);
            }

            _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
            mfp.ev.off(EVENT_NS);

            // clean up DOM elements that aren't removed
            mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
            mfp.bgOverlay.attr('class', 'mfp-bg');
            mfp.container.attr('class', 'mfp-container');

            // remove close button from target element
            if (
                mfp.st.showCloseBtn &&
                (!mfp.st.closeBtnInside ||
                    mfp.currTemplate[mfp.currItem.type] === true)
            ) {
                if (mfp.currTemplate.closeBtn)
                    mfp.currTemplate.closeBtn.detach();
            }

            if (mfp.st.autoFocusLast && mfp._lastFocusedEl) {
                $(mfp._lastFocusedEl).focus(); // put tab focus back
            }
            mfp.currItem = null;
            mfp.content = null;
            mfp.currTemplate = null;
            mfp.prevHeight = 0;

            _mfpTrigger(AFTER_CLOSE_EVENT);
        },

        updateSize: function (winHeight) {
            if (mfp.isIOS) {
                // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
                var zoomLevel =
                    document.documentElement.clientWidth / window.innerWidth;
                var height = window.innerHeight * zoomLevel;
                mfp.wrap.css('height', height);
                mfp.wH = height;
            } else {
                mfp.wH = winHeight || _window.height();
            }
            // Fixes #84: popup incorrectly positioned with position:relative on body
            if (!mfp.fixedContentPos) {
                mfp.wrap.css('height', mfp.wH);
            }

            _mfpTrigger('Resize');
        },

        /**
         * Set content of popup based on current index
         */
        updateItemHTML: function () {
            var item = mfp.items[mfp.index];

            // Detach and perform modifications
            mfp.contentContainer.detach();

            if (mfp.content) mfp.content.detach();

            if (!item.parsed) {
                item = mfp.parseEl(mfp.index);
            }

            var type = item.type;

            _mfpTrigger('BeforeChange', [
                mfp.currItem ? mfp.currItem.type : '',
                type,
            ]);
            // BeforeChange event works like so:
            // _mfpOn('BeforeChange', function(e, prevType, newType) { });

            mfp.currItem = item;

            if (!mfp.currTemplate[type]) {
                var markup = mfp.st[type] ? mfp.st[type].markup : false;

                // allows to modify markup
                _mfpTrigger('FirstMarkupParse', markup);

                if (markup) {
                    mfp.currTemplate[type] = $(markup);
                } else {
                    // if there is no markup found we just define that template is parsed
                    mfp.currTemplate[type] = true;
                }
            }

            if (_prevContentType && _prevContentType !== item.type) {
                mfp.container.removeClass(
                    'mfp-' + _prevContentType + '-holder'
                );
            }

            var newContent = mfp[
                'get' + type.charAt(0).toUpperCase() + type.slice(1)
            ](item, mfp.currTemplate[type]);
            mfp.appendContent(newContent, type);

            item.preloaded = true;

            _mfpTrigger(CHANGE_EVENT, item);
            _prevContentType = item.type;

            // Append container back after its content changed
            mfp.container.prepend(mfp.contentContainer);

            _mfpTrigger('AfterChange');
        },

        /**
         * Set HTML content of popup
         */
        appendContent: function (newContent, type) {
            mfp.content = newContent;

            if (newContent) {
                if (
                    mfp.st.showCloseBtn &&
                    mfp.st.closeBtnInside &&
                    mfp.currTemplate[type] === true
                ) {
                    // if there is no markup, we just append close button element inside
                    if (!mfp.content.find('.mfp-close').length) {
                        mfp.content.append(_getCloseBtn());
                    }
                } else {
                    mfp.content = newContent;
                }
            } else {
                mfp.content = '';
            }

            _mfpTrigger(BEFORE_APPEND_EVENT);
            mfp.container.addClass('mfp-' + type + '-holder');

            mfp.contentContainer.append(mfp.content);
        },

        /**
         * Creates Magnific Popup data object based on given data
         * @param  {int} index Index of item to parse
         */
        parseEl: function (index) {
            var item = mfp.items[index],
                type;

            if (item.tagName) {
                item = { el: $(item) };
            } else {
                type = item.type;
                item = { data: item, src: item.src };
            }

            if (item.el) {
                var types = mfp.types;

                // check for 'mfp-TYPE' class
                for (var i = 0; i < types.length; i++) {
                    if (item.el.hasClass('mfp-' + types[i])) {
                        type = types[i];
                        break;
                    }
                }

                item.src = item.el.attr('data-mfp-src');
                if (!item.src) {
                    item.src = item.el.attr('href');
                }
            }

            item.type = type || mfp.st.type || 'inline';
            item.index = index;
            item.parsed = true;
            mfp.items[index] = item;
            _mfpTrigger('ElementParse', item);

            return mfp.items[index];
        },

        /**
         * Initializes single popup or a group of popups
         */
        addGroup: function (el, options) {
            var eHandler = function (e) {
                e.mfpEl = this;
                mfp._openClick(e, el, options);
            };

            if (!options) {
                options = {};
            }

            var eName = 'click.magnificPopup';
            options.mainEl = el;

            if (options.items) {
                options.isObj = true;
                el.off(eName).on(eName, eHandler);
            } else {
                options.isObj = false;
                if (options.delegate) {
                    el.off(eName).on(eName, options.delegate, eHandler);
                } else {
                    options.items = el;
                    el.off(eName).on(eName, eHandler);
                }
            }
        },
        _openClick: function (e, el, options) {
            var midClick =
                options.midClick !== undefined
                    ? options.midClick
                    : $.magnificPopup.defaults.midClick;

            if (
                !midClick &&
                (e.which === 2 ||
                    e.ctrlKey ||
                    e.metaKey ||
                    e.altKey ||
                    e.shiftKey)
            ) {
                return;
            }

            var disableOn =
                options.disableOn !== undefined
                    ? options.disableOn
                    : $.magnificPopup.defaults.disableOn;

            if (disableOn) {
                if ($.isFunction(disableOn)) {
                    if (!disableOn.call(mfp)) {
                        return true;
                    }
                } else {
                    // else it's number
                    if (_window.width() < disableOn) {
                        return true;
                    }
                }
            }

            if (e.type) {
                e.preventDefault();

                // This will prevent popup from closing if element is inside and popup is already opened
                if (mfp.isOpen) {
                    e.stopPropagation();
                }
            }

            options.el = $(e.mfpEl);
            if (options.delegate) {
                options.items = el.find(options.delegate);
            }
            mfp.open(options);
        },

        /**
         * Updates text on preloader
         */
        updateStatus: function (status, text) {
            if (mfp.preloader) {
                if (_prevStatus !== status) {
                    mfp.container.removeClass('mfp-s-' + _prevStatus);
                }

                if (!text && status === 'loading') {
                    text = mfp.st.tLoading;
                }

                var data = {
                    status: status,
                    text: text,
                };
                // allows to modify status
                _mfpTrigger('UpdateStatus', data);

                status = data.status;
                text = data.text;

                mfp.preloader.html(text);

                mfp.preloader.find('a').on('click', function (e) {
                    e.stopImmediatePropagation();
                });

                mfp.container.addClass('mfp-s-' + status);
                _prevStatus = status;
            }
        },

        /*
		"Private" helpers that aren't private at all
	 */
        // Check to close popup or not
        // "target" is an element that was clicked
        _checkIfClose: function (target) {
            if ($(target).hasClass(PREVENT_CLOSE_CLASS)) {
                return;
            }

            var closeOnContent = mfp.st.closeOnContentClick;
            var closeOnBg = mfp.st.closeOnBgClick;

            if (closeOnContent && closeOnBg) {
                return true;
            } else {
                // We close the popup if click is on close button or on preloader. Or if there is no content.
                if (
                    !mfp.content ||
                    $(target).hasClass('mfp-close') ||
                    (mfp.preloader && target === mfp.preloader[0])
                ) {
                    return true;
                }

                // if click is outside the content
                if (
                    target !== mfp.content[0] &&
                    !$.contains(mfp.content[0], target)
                ) {
                    if (closeOnBg) {
                        // last check, if the clicked element is in DOM, (in case it's removed onclick)
                        if ($.contains(document, target)) {
                            return true;
                        }
                    }
                } else if (closeOnContent) {
                    return true;
                }
            }
            return false;
        },
        _addClassToMFP: function (cName) {
            mfp.bgOverlay.addClass(cName);
            mfp.wrap.addClass(cName);
        },
        _removeClassFromMFP: function (cName) {
            this.bgOverlay.removeClass(cName);
            mfp.wrap.removeClass(cName);
        },
        _hasScrollBar: function (winHeight) {
            return (
                (mfp.isIE7 ? _document.height() : document.body.scrollHeight) >
                (winHeight || _window.height())
            );
        },
        _setFocus: function () {
            (mfp.st.focus
                ? mfp.content.find(mfp.st.focus).eq(0)
                : mfp.wrap
            ).focus();
        },
        _onFocusIn: function (e) {
            if (
                e.target !== mfp.wrap[0] &&
                !$.contains(mfp.wrap[0], e.target)
            ) {
                mfp._setFocus();
                return false;
            }
        },
        _parseMarkup: function (template, values, item) {
            var arr;
            if (item.data) {
                values = $.extend(item.data, values);
            }
            _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]);

            $.each(values, function (key, value) {
                if (value === undefined || value === false) {
                    return true;
                }
                arr = key.split('_');
                if (arr.length > 1) {
                    var el = template.find(EVENT_NS + '-' + arr[0]);

                    if (el.length > 0) {
                        var attr = arr[1];
                        if (attr === 'replaceWith') {
                            if (el[0] !== value[0]) {
                                el.replaceWith(value);
                            }
                        } else if (attr === 'img') {
                            if (el.is('img')) {
                                el.attr('src', value);
                            } else {
                                el.replaceWith(
                                    $('<img>')
                                        .attr('src', value)
                                        .attr('class', el.attr('class'))
                                );
                            }
                        } else {
                            el.attr(arr[1], value);
                        }
                    }
                } else {
                    template.find(EVENT_NS + '-' + key).html(value);
                }
            });
        },

        _getScrollbarSize: function () {
            // thx David
            if (mfp.scrollbarSize === undefined) {
                var scrollDiv = document.createElement('div');
                scrollDiv.style.cssText =
                    'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                mfp.scrollbarSize =
                    scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv);
            }
            return mfp.scrollbarSize;
        },
    }; /* MagnificPopup core prototype end */

    /**
     * Public static functions
     */
    $.magnificPopup = {
        instance: null,
        proto: MagnificPopup.prototype,
        modules: [],

        open: function (options, index) {
            _checkInstance();

            if (!options) {
                options = {};
            } else {
                options = $.extend(true, {}, options);
            }

            options.isObj = true;
            options.index = index || 0;
            return this.instance.open(options);
        },

        close: function () {
            return $.magnificPopup.instance && $.magnificPopup.instance.close();
        },

        registerModule: function (name, module) {
            if (module.options) {
                $.magnificPopup.defaults[name] = module.options;
            }

            $.extend(this.proto, module.proto);
            this.modules.push(name);
        },

        defaults: {
            // Info about options is in docs:
            // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

            disableOn: 0,

            key: null,

            midClick: false,

            mainClass: '',

            preloader: true,

            focus: '', // CSS selector of input to focus after popup is opened

            closeOnContentClick: false,

            closeOnBgClick: true,

            closeBtnInside: true,

            showCloseBtn: true,

            enableEscapeKey: true,

            modal: false,

            alignTop: false,

            removalDelay: 0,

            prependTo: null,

            fixedContentPos: 'auto',

            fixedBgPos: 'auto',

            overflowY: 'auto',

            closeMarkup:
                '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

            tClose: 'Close (Esc)',

            tLoading: 'Loading...',

            autoFocusLast: true,
        },
    };

    $.fn.magnificPopup = function (options) {
        _checkInstance();

        var jqEl = $(this);

        // We call some API method of first param is a string
        if (typeof options === 'string') {
            if (options === 'open') {
                var items,
                    itemOpts = _isJQ
                        ? jqEl.data('magnificPopup')
                        : jqEl[0].magnificPopup,
                    index = parseInt(arguments[1], 10) || 0;

                if (itemOpts.items) {
                    items = itemOpts.items[index];
                } else {
                    items = jqEl;
                    if (itemOpts.delegate) {
                        items = items.find(itemOpts.delegate);
                    }
                    items = items.eq(index);
                }
                mfp._openClick({ mfpEl: items }, jqEl, itemOpts);
            } else {
                if (mfp.isOpen)
                    mfp[options].apply(
                        mfp,
                        Array.prototype.slice.call(arguments, 1)
                    );
            }
        } else {
            // clone options obj
            options = $.extend(true, {}, options);

            /*
             * As Zepto doesn't support .data() method for objects
             * and it works only in normal browsers
             * we assign "options" object directly to the DOM element. FTW!
             */
            if (_isJQ) {
                jqEl.data('magnificPopup', options);
            } else {
                jqEl[0].magnificPopup = options;
            }

            mfp.addGroup(jqEl, options);
        }
        return jqEl;
    };

    /*>>core*/

    /*>>inline*/

    var INLINE_NS = 'inline',
        _hiddenClass,
        _inlinePlaceholder,
        _lastInlineElement,
        _putInlineElementsBack = function () {
            if (_lastInlineElement) {
                _inlinePlaceholder
                    .after(_lastInlineElement.addClass(_hiddenClass))
                    .detach();
                _lastInlineElement = null;
            }
        };

    $.magnificPopup.registerModule(INLINE_NS, {
        options: {
            hiddenClass: 'hide', // will be appended with `mfp-` prefix
            markup: '',
            tNotFound: 'Content not found',
        },
        proto: {
            initInline: function () {
                mfp.types.push(INLINE_NS);

                _mfpOn(CLOSE_EVENT + '.' + INLINE_NS, function () {
                    _putInlineElementsBack();
                });
            },

            getInline: function (item, template) {
                _putInlineElementsBack();

                if (item.src) {
                    var inlineSt = mfp.st.inline,
                        el = $(item.src);

                    if (el.length) {
                        // If target element has parent - we replace it with placeholder and put it back after popup is closed
                        var parent = el[0].parentNode;
                        if (parent && parent.tagName) {
                            if (!_inlinePlaceholder) {
                                _hiddenClass = inlineSt.hiddenClass;
                                _inlinePlaceholder = _getEl(_hiddenClass);
                                _hiddenClass = 'mfp-' + _hiddenClass;
                            }
                            // replace target inline element with placeholder
                            _lastInlineElement = el
                                .after(_inlinePlaceholder)
                                .detach()
                                .removeClass(_hiddenClass);
                        }

                        mfp.updateStatus('ready');
                    } else {
                        mfp.updateStatus('error', inlineSt.tNotFound);
                        el = $('<div>');
                    }

                    item.inlineElement = el;
                    return el;
                }

                mfp.updateStatus('ready');
                mfp._parseMarkup(template, {}, item);
                return template;
            },
        },
    });

    /*>>inline*/

    /*>>ajax*/
    var AJAX_NS = 'ajax',
        _ajaxCur,
        _removeAjaxCursor = function () {
            if (_ajaxCur) {
                $(document.body).removeClass(_ajaxCur);
            }
        },
        _destroyAjaxRequest = function () {
            _removeAjaxCursor();
            if (mfp.req) {
                mfp.req.abort();
            }
        };

    $.magnificPopup.registerModule(AJAX_NS, {
        options: {
            settings: null,
            cursor: 'mfp-ajax-cur',
            tError: '<a href="%url%">The content</a> could not be loaded.',
        },

        proto: {
            initAjax: function () {
                mfp.types.push(AJAX_NS);
                _ajaxCur = mfp.st.ajax.cursor;

                _mfpOn(CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest);
                _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
            },
            getAjax: function (item) {
                if (_ajaxCur) {
                    $(document.body).addClass(_ajaxCur);
                }

                mfp.updateStatus('loading');

                var opts = $.extend(
                    {
                        url: item.src,
                        success: function (data, textStatus, jqXHR) {
                            var temp = {
                                data: data,
                                xhr: jqXHR,
                            };

                            _mfpTrigger('ParseAjax', temp);

                            mfp.appendContent($(temp.data), AJAX_NS);

                            item.finished = true;

                            _removeAjaxCursor();

                            mfp._setFocus();

                            setTimeout(function () {
                                mfp.wrap.addClass(READY_CLASS);
                            }, 16);

                            mfp.updateStatus('ready');

                            _mfpTrigger('AjaxContentAdded');
                        },
                        error: function () {
                            _removeAjaxCursor();
                            item.finished = item.loadError = true;
                            mfp.updateStatus(
                                'error',
                                mfp.st.ajax.tError.replace('%url%', item.src)
                            );
                        },
                    },
                    mfp.st.ajax.settings
                );

                mfp.req = $.ajax(opts);

                return '';
            },
        },
    });

    /*>>ajax*/

    /*>>image*/
    var _imgInterval,
        _getTitle = function (item) {
            if (item.data && item.data.title !== undefined)
                return item.data.title;

            var src = mfp.st.image.titleSrc;

            if (src) {
                if ($.isFunction(src)) {
                    return src.call(mfp, item);
                } else if (item.el) {
                    return item.el.attr(src) || '';
                }
            }
            return '';
        };

    $.magnificPopup.registerModule('image', {
        options: {
            markup:
                '<div class="mfp-figure">' +
                '<div class="mfp-close"></div>' +
                '<figure>' +
                '<div class="mfp-img"></div>' +
                '<figcaption>' +
                '<div class="mfp-bottom-bar">' +
                '<div class="mfp-title"></div>' +
                '<div class="mfp-counter"></div>' +
                '</div>' +
                '</figcaption>' +
                '</figure>' +
                '</div>',
            cursor: 'mfp-zoom-out-cur',
            titleSrc: 'title',
            verticalFit: true,
            tError: '<a href="%url%">The image</a> could not be loaded.',
        },

        proto: {
            initImage: function () {
                var imgSt = mfp.st.image,
                    ns = '.image';

                mfp.types.push('image');

                _mfpOn(OPEN_EVENT + ns, function () {
                    if (mfp.currItem.type === 'image' && imgSt.cursor) {
                        $(document.body).addClass(imgSt.cursor);
                    }
                });

                _mfpOn(CLOSE_EVENT + ns, function () {
                    if (imgSt.cursor) {
                        $(document.body).removeClass(imgSt.cursor);
                    }
                    _window.off('resize' + EVENT_NS);
                });

                _mfpOn('Resize' + ns, mfp.resizeImage);
                if (mfp.isLowIE) {
                    _mfpOn('AfterChange', mfp.resizeImage);
                }
            },
            resizeImage: function () {
                var item = mfp.currItem;
                if (!item || !item.img) return;

                if (mfp.st.image.verticalFit) {
                    var decr = 0;
                    // fix box-sizing in ie7/8
                    if (mfp.isLowIE) {
                        decr =
                            parseInt(item.img.css('padding-top'), 10) +
                            parseInt(item.img.css('padding-bottom'), 10);
                    }
                    item.img.css('max-height', mfp.wH - decr);
                }
            },
            _onImageHasSize: function (item) {
                if (item.img) {
                    item.hasSize = true;

                    if (_imgInterval) {
                        clearInterval(_imgInterval);
                    }

                    item.isCheckingImgSize = false;

                    _mfpTrigger('ImageHasSize', item);

                    if (item.imgHidden) {
                        if (mfp.content) mfp.content.removeClass('mfp-loading');

                        item.imgHidden = false;
                    }
                }
            },

            /**
             * Function that loops until the image has size to display elements that rely on it asap
             */
            findImageSize: function (item) {
                var counter = 0,
                    img = item.img[0],
                    mfpSetInterval = function (delay) {
                        if (_imgInterval) {
                            clearInterval(_imgInterval);
                        }
                        // decelerating interval that checks for size of an image
                        _imgInterval = setInterval(function () {
                            if (img.naturalWidth > 0) {
                                mfp._onImageHasSize(item);
                                return;
                            }

                            if (counter > 200) {
                                clearInterval(_imgInterval);
                            }

                            counter++;
                            if (counter === 3) {
                                mfpSetInterval(10);
                            } else if (counter === 40) {
                                mfpSetInterval(50);
                            } else if (counter === 100) {
                                mfpSetInterval(500);
                            }
                        }, delay);
                    };

                mfpSetInterval(1);
            },

            getImage: function (item, template) {
                var guard = 0,
                    // image load complete handler
                    onLoadComplete = function () {
                        if (item) {
                            if (item.img[0].complete) {
                                item.img.off('.mfploader');

                                if (item === mfp.currItem) {
                                    mfp._onImageHasSize(item);

                                    mfp.updateStatus('ready');
                                }

                                item.hasSize = true;
                                item.loaded = true;

                                _mfpTrigger('ImageLoadComplete');
                            } else {
                                // if image complete check fails 200 times (20 sec), we assume that there was an error.
                                guard++;
                                if (guard < 200) {
                                    setTimeout(onLoadComplete, 100);
                                } else {
                                    onLoadError();
                                }
                            }
                        }
                    },
                    // image error handler
                    onLoadError = function () {
                        if (item) {
                            item.img.off('.mfploader');
                            if (item === mfp.currItem) {
                                mfp._onImageHasSize(item);
                                mfp.updateStatus(
                                    'error',
                                    imgSt.tError.replace('%url%', item.src)
                                );
                            }

                            item.hasSize = true;
                            item.loaded = true;
                            item.loadError = true;
                        }
                    },
                    imgSt = mfp.st.image;

                var el = template.find('.mfp-img');
                if (el.length) {
                    var img = document.createElement('img');
                    img.className = 'mfp-img';
                    if (item.el && item.el.find('img').length) {
                        img.alt = item.el.find('img').attr('alt');
                    }
                    item.img = $(img)
                        .on('load.mfploader', onLoadComplete)
                        .on('error.mfploader', onLoadError);
                    img.src = item.src;

                    // without clone() "error" event is not firing when IMG is replaced by new IMG
                    // TODO: find a way to avoid such cloning
                    if (el.is('img')) {
                        item.img = item.img.clone();
                    }

                    img = item.img[0];
                    if (img.naturalWidth > 0) {
                        item.hasSize = true;
                    } else if (!img.width) {
                        item.hasSize = false;
                    }
                }

                mfp._parseMarkup(
                    template,
                    {
                        title: _getTitle(item),
                        img_replaceWith: item.img,
                    },
                    item
                );

                mfp.resizeImage();

                if (item.hasSize) {
                    if (_imgInterval) clearInterval(_imgInterval);

                    if (item.loadError) {
                        template.addClass('mfp-loading');
                        mfp.updateStatus(
                            'error',
                            imgSt.tError.replace('%url%', item.src)
                        );
                    } else {
                        template.removeClass('mfp-loading');
                        mfp.updateStatus('ready');
                    }
                    return template;
                }

                mfp.updateStatus('loading');
                item.loading = true;

                if (!item.hasSize) {
                    item.imgHidden = true;
                    template.addClass('mfp-loading');
                    mfp.findImageSize(item);
                }

                return template;
            },
        },
    });

    /*>>image*/

    /*>>zoom*/
    var hasMozTransform,
        getHasMozTransform = function () {
            if (hasMozTransform === undefined) {
                hasMozTransform =
                    document.createElement('p').style.MozTransform !==
                    undefined;
            }
            return hasMozTransform;
        };

    $.magnificPopup.registerModule('zoom', {
        options: {
            enabled: false,
            easing: 'ease-in-out',
            duration: 300,
            opener: function (element) {
                return element.is('img') ? element : element.find('img');
            },
        },

        proto: {
            initZoom: function () {
                var zoomSt = mfp.st.zoom,
                    ns = '.zoom',
                    image;

                if (!zoomSt.enabled || !mfp.supportsTransition) {
                    return;
                }

                var duration = zoomSt.duration,
                    getElToAnimate = function (image) {
                        var newImg = image
                                .clone()
                                .removeAttr('style')
                                .removeAttr('class')
                                .addClass('mfp-animated-image'),
                            transition =
                                'all ' +
                                zoomSt.duration / 1000 +
                                's ' +
                                zoomSt.easing,
                            cssObj = {
                                position: 'fixed',
                                zIndex: 9999,
                                left: 0,
                                top: 0,
                                '-webkit-backface-visibility': 'hidden',
                            },
                            t = 'transition';

                        cssObj['-webkit-' + t] =
                            cssObj['-moz-' + t] =
                            cssObj['-o-' + t] =
                            cssObj[t] =
                                transition;

                        newImg.css(cssObj);
                        return newImg;
                    },
                    showMainContent = function () {
                        mfp.content.css('visibility', 'visible');
                    },
                    openTimeout,
                    animatedImg;

                _mfpOn('BuildControls' + ns, function () {
                    if (mfp._allowZoom()) {
                        clearTimeout(openTimeout);
                        mfp.content.css('visibility', 'hidden');

                        // Basically, all code below does is clones existing image, puts in on top of the current one and animated it

                        image = mfp._getItemToZoom();

                        if (!image) {
                            showMainContent();
                            return;
                        }

                        animatedImg = getElToAnimate(image);

                        animatedImg.css(mfp._getOffset());

                        mfp.wrap.append(animatedImg);

                        openTimeout = setTimeout(function () {
                            animatedImg.css(mfp._getOffset(true));
                            openTimeout = setTimeout(function () {
                                showMainContent();

                                setTimeout(function () {
                                    animatedImg.remove();
                                    image = animatedImg = null;
                                    _mfpTrigger('ZoomAnimationEnded');
                                }, 16); // avoid blink when switching images
                            }, duration); // this timeout equals animation duration
                        }, 16); // by adding this timeout we avoid short glitch at the beginning of animation

                        // Lots of timeouts...
                    }
                });
                _mfpOn(BEFORE_CLOSE_EVENT + ns, function () {
                    if (mfp._allowZoom()) {
                        clearTimeout(openTimeout);

                        mfp.st.removalDelay = duration;

                        if (!image) {
                            image = mfp._getItemToZoom();
                            if (!image) {
                                return;
                            }
                            animatedImg = getElToAnimate(image);
                        }

                        animatedImg.css(mfp._getOffset(true));
                        mfp.wrap.append(animatedImg);
                        mfp.content.css('visibility', 'hidden');

                        setTimeout(function () {
                            animatedImg.css(mfp._getOffset());
                        }, 16);
                    }
                });

                _mfpOn(CLOSE_EVENT + ns, function () {
                    if (mfp._allowZoom()) {
                        showMainContent();
                        if (animatedImg) {
                            animatedImg.remove();
                        }
                        image = null;
                    }
                });
            },

            _allowZoom: function () {
                return mfp.currItem.type === 'image';
            },

            _getItemToZoom: function () {
                if (mfp.currItem.hasSize) {
                    return mfp.currItem.img;
                } else {
                    return false;
                }
            },

            // Get element postion relative to viewport
            _getOffset: function (isLarge) {
                var el;
                if (isLarge) {
                    el = mfp.currItem.img;
                } else {
                    el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
                }

                var offset = el.offset();
                var paddingTop = parseInt(el.css('padding-top'), 10);
                var paddingBottom = parseInt(el.css('padding-bottom'), 10);
                offset.top -= $(window).scrollTop() - paddingTop;

                /*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
                var obj = {
                    width: el.width(),
                    // fix Zepto height+padding issue
                    height:
                        (_isJQ ? el.innerHeight() : el[0].offsetHeight) -
                        paddingBottom -
                        paddingTop,
                };

                // I hate to do this, but there is no another option
                if (getHasMozTransform()) {
                    obj['-moz-transform'] = obj['transform'] =
                        'translate(' + offset.left + 'px,' + offset.top + 'px)';
                } else {
                    obj.left = offset.left;
                    obj.top = offset.top;
                }
                return obj;
            },
        },
    });

    /*>>zoom*/

    /*>>iframe*/

    var IFRAME_NS = 'iframe',
        _emptyPage = '//about:blank',
        _fixIframeBugs = function (isShowing) {
            if (mfp.currTemplate[IFRAME_NS]) {
                var el = mfp.currTemplate[IFRAME_NS].find('iframe');
                if (el.length) {
                    // reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
                    if (!isShowing) {
                        el[0].src = _emptyPage;
                    }

                    // IE8 black screen bug fix
                    if (mfp.isIE8) {
                        el.css('display', isShowing ? 'block' : 'none');
                    }
                }
            }
        };

    $.magnificPopup.registerModule(IFRAME_NS, {
        options: {
            markup:
                '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' +
                '</div>',

            srcAction: 'iframe_src',

            // we don't care and support only one default type of URL by default
            patterns: {
                youtube: {
                    index: 'youtube.com',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1',
                },
                vimeo: {
                    index: 'vimeo.com/',
                    id: '/',
                    src: '//player.vimeo.com/video/%id%?autoplay=1',
                },
                gmaps: {
                    index: '//maps.google.',
                    src: '%id%&output=embed',
                },
            },
        },

        proto: {
            initIframe: function () {
                mfp.types.push(IFRAME_NS);

                _mfpOn('BeforeChange', function (e, prevType, newType) {
                    if (prevType !== newType) {
                        if (prevType === IFRAME_NS) {
                            _fixIframeBugs(); // iframe if removed
                        } else if (newType === IFRAME_NS) {
                            _fixIframeBugs(true); // iframe is showing
                        }
                    } // else {
                    // iframe source is switched, don't do anything
                    //}
                });

                _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function () {
                    _fixIframeBugs();
                });
            },

            getIframe: function (item, template) {
                var embedSrc = item.src;
                var iframeSt = mfp.st.iframe;

                $.each(iframeSt.patterns, function () {
                    if (embedSrc.indexOf(this.index) > -1) {
                        if (this.id) {
                            if (typeof this.id === 'string') {
                                embedSrc = embedSrc.substr(
                                    embedSrc.lastIndexOf(this.id) +
                                        this.id.length,
                                    embedSrc.length
                                );
                            } else {
                                embedSrc = this.id.call(this, embedSrc);
                            }
                        }
                        embedSrc = this.src.replace('%id%', embedSrc);
                        return false; // break;
                    }
                });

                var dataObj = {};
                if (iframeSt.srcAction) {
                    dataObj[iframeSt.srcAction] = embedSrc;
                }
                mfp._parseMarkup(template, dataObj, item);

                mfp.updateStatus('ready');

                return template;
            },
        },
    });

    /*>>iframe*/

    /*>>gallery*/
    /**
     * Get looped index depending on number of slides
     */
    var _getLoopedId = function (index) {
            var numSlides = mfp.items.length;
            if (index > numSlides - 1) {
                return index - numSlides;
            } else if (index < 0) {
                return numSlides + index;
            }
            return index;
        },
        _replaceCurrTotal = function (text, curr, total) {
            return text
                .replace(/%curr%/gi, curr + 1)
                .replace(/%total%/gi, total);
        };

    $.magnificPopup.registerModule('gallery', {
        options: {
            enabled: false,
            arrowMarkup:
                '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: true,
            arrows: true,

            tPrev: 'Previous (Left arrow key)',
            tNext: 'Next (Right arrow key)',
            tCounter: '%curr% of %total%',
        },

        proto: {
            initGallery: function () {
                var gSt = mfp.st.gallery,
                    ns = '.mfp-gallery';

                mfp.direction = true; // true - next, false - prev

                if (!gSt || !gSt.enabled) return false;

                _wrapClasses += ' mfp-gallery';

                _mfpOn(OPEN_EVENT + ns, function () {
                    if (gSt.navigateByImgClick) {
                        mfp.wrap.on('click' + ns, '.mfp-img', function () {
                            if (mfp.items.length > 1) {
                                mfp.next();
                                return false;
                            }
                        });
                    }

                    _document.on('keydown' + ns, function (e) {
                        if (e.keyCode === 37) {
                            mfp.prev();
                        } else if (e.keyCode === 39) {
                            mfp.next();
                        }
                    });
                });

                _mfpOn('UpdateStatus' + ns, function (e, data) {
                    if (data.text) {
                        data.text = _replaceCurrTotal(
                            data.text,
                            mfp.currItem.index,
                            mfp.items.length
                        );
                    }
                });

                _mfpOn(
                    MARKUP_PARSE_EVENT + ns,
                    function (e, element, values, item) {
                        var l = mfp.items.length;
                        values.counter =
                            l > 1
                                ? _replaceCurrTotal(gSt.tCounter, item.index, l)
                                : '';
                    }
                );

                _mfpOn('BuildControls' + ns, function () {
                    if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
                        var markup = gSt.arrowMarkup,
                            arrowLeft = (mfp.arrowLeft = $(
                                markup
                                    .replace(/%title%/gi, gSt.tPrev)
                                    .replace(/%dir%/gi, 'left')
                            ).addClass(PREVENT_CLOSE_CLASS)),
                            arrowRight = (mfp.arrowRight = $(
                                markup
                                    .replace(/%title%/gi, gSt.tNext)
                                    .replace(/%dir%/gi, 'right')
                            ).addClass(PREVENT_CLOSE_CLASS));

                        arrowLeft.click(function () {
                            mfp.prev();
                        });
                        arrowRight.click(function () {
                            mfp.next();
                        });

                        mfp.container.append(arrowLeft.add(arrowRight));
                    }
                });

                _mfpOn(CHANGE_EVENT + ns, function () {
                    if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

                    mfp._preloadTimeout = setTimeout(function () {
                        mfp.preloadNearbyImages();
                        mfp._preloadTimeout = null;
                    }, 16);
                });

                _mfpOn(CLOSE_EVENT + ns, function () {
                    _document.off(ns);
                    mfp.wrap.off('click' + ns);
                    mfp.arrowRight = mfp.arrowLeft = null;
                });
            },
            next: function () {
                mfp.direction = true;
                mfp.index = _getLoopedId(mfp.index + 1);
                mfp.updateItemHTML();
            },
            prev: function () {
                mfp.direction = false;
                mfp.index = _getLoopedId(mfp.index - 1);
                mfp.updateItemHTML();
            },
            goTo: function (newIndex) {
                mfp.direction = newIndex >= mfp.index;
                mfp.index = newIndex;
                mfp.updateItemHTML();
            },
            preloadNearbyImages: function () {
                var p = mfp.st.gallery.preload,
                    preloadBefore = Math.min(p[0], mfp.items.length),
                    preloadAfter = Math.min(p[1], mfp.items.length),
                    i;

                for (
                    i = 1;
                    i <= (mfp.direction ? preloadAfter : preloadBefore);
                    i++
                ) {
                    mfp._preloadItem(mfp.index + i);
                }
                for (
                    i = 1;
                    i <= (mfp.direction ? preloadBefore : preloadAfter);
                    i++
                ) {
                    mfp._preloadItem(mfp.index - i);
                }
            },
            _preloadItem: function (index) {
                index = _getLoopedId(index);

                if (mfp.items[index].preloaded) {
                    return;
                }

                var item = mfp.items[index];
                if (!item.parsed) {
                    item = mfp.parseEl(index);
                }

                _mfpTrigger('LazyLoad', item);

                if (item.type === 'image') {
                    item.img = $('<img class="mfp-img" />')
                        .on('load.mfploader', function () {
                            item.hasSize = true;
                        })
                        .on('error.mfploader', function () {
                            item.hasSize = true;
                            item.loadError = true;
                            _mfpTrigger('LazyLoadError', item);
                        })
                        .attr('src', item.src);
                }

                item.preloaded = true;
            },
        },
    });

    /*>>gallery*/

    /*>>retina*/

    var RETINA_NS = 'retina';

    $.magnificPopup.registerModule(RETINA_NS, {
        options: {
            replaceSrc: function (item) {
                return item.src.replace(/\.\w+$/, function (m) {
                    return '@2x' + m;
                });
            },
            ratio: 1, // Function or number.  Set to 1 to disable.
        },
        proto: {
            initRetina: function () {
                if (window.devicePixelRatio > 1) {
                    var st = mfp.st.retina,
                        ratio = st.ratio;

                    ratio = !isNaN(ratio) ? ratio : ratio();

                    if (ratio > 1) {
                        _mfpOn(
                            'ImageHasSize' + '.' + RETINA_NS,
                            function (e, item) {
                                item.img.css({
                                    'max-width':
                                        item.img[0].naturalWidth / ratio,
                                    width: '100%',
                                });
                            }
                        );
                        _mfpOn(
                            'ElementParse' + '.' + RETINA_NS,
                            function (e, item) {
                                item.src = st.replaceSrc(item, ratio);
                            }
                        );
                    }
                }
            },
        },
    });

    /*>>retina*/
    _checkInstance();
});
/*!
 * jQuery Placeholder Plugin v2.3.1
 * https://github.com/mathiasbynens/jquery-placeholder
 *
 * Copyright 2011, 2015 Mathias Bynens
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    /****
     * Allows plugin behavior simulation in modern browsers for easier debugging.
     * When setting to true, use attribute "placeholder-x" rather than the usual "placeholder" in your inputs/textareas
     * i.e. <input type="text" placeholder-x="my placeholder text" />
     */
    var debugMode = false;

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini =
        Object.prototype.toString.call(window.operamini) ===
        '[object OperaMini]';
    var isInputSupported =
        'placeholder' in document.createElement('input') &&
        !isOperaMini &&
        !debugMode;
    var isTextareaSupported =
        'placeholder' in document.createElement('textarea') &&
        !isOperaMini &&
        !debugMode;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    var settings = {};

    if (isInputSupported && isTextareaSupported) {
        placeholder = $.fn.placeholder = function () {
            return this;
        };

        placeholder.input = true;
        placeholder.textarea = true;
    } else {
        placeholder = $.fn.placeholder = function (options) {
            var defaults = { customClass: 'placeholder' };
            settings = $.extend({}, defaults, options);

            return this.filter(
                (isInputSupported ? 'textarea' : ':input') +
                    '[' +
                    (debugMode ? 'placeholder-x' : 'placeholder') +
                    ']'
            )
                .not('.' + settings.customClass)
                .not(':radio, :checkbox, [type=hidden]')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder,
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            get: function (element) {
                var $element = $(element);
                var $passwordInput = $element.data('placeholder-password');

                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') &&
                    $element.hasClass(settings.customClass)
                    ? ''
                    : element.value;
            },
            set: function (element, value) {
                var $element = $(element);
                var $replacement;
                var $passwordInput;

                if (value !== '') {
                    $replacement = $element.data('placeholder-textinput');
                    $passwordInput = $element.data('placeholder-password');

                    if ($replacement) {
                        clearPlaceholder.call($replacement[0], true, value) ||
                            (element.value = value);
                        $replacement[0].value = value;
                    } else if ($passwordInput) {
                        clearPlaceholder.call(element, true, value) ||
                            ($passwordInput[0].value = value);
                        element.value = value;
                    }
                }

                if (!$element.data('placeholder-enabled')) {
                    element.value = value;
                    return $element;
                }

                if (value === '') {
                    element.value = value;

                    // Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else {
                    if ($element.hasClass(settings.customClass)) {
                        clearPlaceholder.call(element);
                    }

                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            },
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }

        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function () {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function () {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.' + settings.customClass, this).each(
                    function () {
                        clearPlaceholder.call(this, true, '');
                    }
                );

                setTimeout(function () {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function () {
            var clearPlaceholders = true;

            try {
                // Prevent IE javascript:void(0) anchors from causing cleared values
                if (
                    document.activeElement.toString() === 'javascript:void(0)'
                ) {
                    clearPlaceholders = false;
                }
            } catch (exception) {}

            if (clearPlaceholders) {
                $('.' + settings.customClass).each(function () {
                    this.value = '';
                });
            }
        });
    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;

        $.each(elem.attributes, function (i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });

        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(this);

        if (
            input.value ===
                $input.attr(debugMode ? 'placeholder-x' : 'placeholder') &&
            $input.hasClass(settings.customClass)
        ) {
            input.value = '';
            $input.removeClass(settings.customClass);

            if ($input.data('placeholder-password')) {
                $input = $input
                    .hide()
                    .nextAll('input[type="password"]:first')
                    .show()
                    .attr('id', $input.removeAttr('id').data('placeholder-id'));

                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    $input[0].value = value;

                    return value;
                }

                $input.focus();
            } else {
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder(event) {
        var $replacement;
        var input = this;
        var $input = $(this);
        var id = input.id;

        // If the placeholder is activated, triggering blur event (`$input.trigger('blur')`) should do nothing.
        if (
            event &&
            event.type === 'blur' &&
            $input.hasClass(settings.customClass)
        ) {
            return;
        }

        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().prop({ type: 'text' });
                    } catch (e) {
                        $replacement = $('<input>').attr(
                            $.extend(args(this), { type: 'text' })
                        );
                    }

                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-enabled': true,
                            'placeholder-password': $input,
                            'placeholder-id': id,
                        })
                        .bind('focus.placeholder', clearPlaceholder);

                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id,
                        })
                        .before($replacement);
                }

                input.value = '';
                $input = $input
                    .removeAttr('id')
                    .hide()
                    .prevAll('input[type="text"]:first')
                    .attr('id', $input.data('placeholder-id'))
                    .show();
            } else {
                var $passwordInput = $input.data('placeholder-password');

                if ($passwordInput) {
                    $passwordInput[0].value = '';
                    $input
                        .attr('id', $input.data('placeholder-id'))
                        .show()
                        .nextAll('input[type="password"]:last')
                        .hide()
                        .removeAttr('id');
                }
            }

            $input.addClass(settings.customClass);
            $input[0].value = $input.attr(
                debugMode ? 'placeholder-x' : 'placeholder'
            );
        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        try {
            return document.activeElement;
        } catch (exception) {}
    }
});
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

        /*---------------------------------------------------------
			On Scroll
			--only runs once per scroll session
		----------------------------------------------------------*/
        function scrollAddClass() {
            if ($(window).scrollTop() > 10) {
                $('body').addClass('hide-menu-tabs');
            } else {
                $('body').removeClass('hide-menu-tabs');
            }
        }

        $(window).scroll($.debounce(20, scrollAddClass));

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
