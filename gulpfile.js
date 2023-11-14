// Include gulp from our installed npm package dependencies
const gulp = require('gulp');

// Include the rest of our installed npm package dependencies
const autoprefixer = require('autoprefixer'); // this auto prefixes certain css rules that might have browser vendor prefixes
const bourbon = require('bourbon').includePaths; // bourbon is a set of kinda cool sass functions you can find here: https://www.bourbon.io/docs/latest/
const babel = require('gulp-babel'); // babel lets you use modern/next gen JS in your source, and it spits out something compatible with more browsers
const jshint = require('gulp-jshint'); // this is our linter for js - fix and warn about common js code issues and potential bugs
const sass = require('gulp-sass')(require('sass')); // our scss/sass processor - a much better way to write CSS
const concat = require('gulp-concat'); // lets you combine files into 1
const uglify = require('gulp-uglify'); // runs uglify - a js minifier. compresses js file size
const rename = require('gulp-rename'); // lets you rename files
const minifycss = require('gulp-clean-css'); // kinda like uglify, but for css
const postcss = require('gulp-postcss'); // process the css file with auto prefixer from above, and pxtorem from below
//const squoosh = require('gulp-libsquoosh'); // allows for images to be dynamically minified through Gulp
const pxtorem = require('postcss-pxtorem'); // write all your units as pixels, and this will also create a second rule of it as rem - all the benefits of using relative unit without the math

/**
 * Basic structure of all gulp functions:
 *      - first, use .src to collect a bunch of files,
 *          and using asterisks to mark wildcards
 *      - and then use .pipe to send the data into a series of packages/functions
 *      - the functions to be piped to can include any of the packages we imported,
 *          or gulp.dest in order to spit out the processed info into a file.
 */

/**
 * Lint Scripts - comb through our custom scripts to look for common issues,
 * some which will be fixed,
 * others which will be reported to the command line as warnings or errors.
 */
function lintScripts() {
    return gulp
        .src(['assets/js/src/custom-scripts.js'])
        .pipe(
            jshint({
                asi: true,
                expr: true,
                esnext: true,
                sub: true,
                eqnull: true,
                multistr: true,
                laxbreak: true,
            })
        )
        .pipe(jshint.reporter('default'));
}

/**
 * Compile SASS - make the sass css,
 * then run it through postcss, minify that,
 * and then spit it out into the root theme folder as style.css.
 * It's important to note that any sass file without _ (underscore) at the front of it will be spit out,
 * and style.scss should be the only sass file like that.
 */
function compileSass() {
    return gulp
        .src(['assets/scss/*.scss', 'template-parts/modules/*.scss'], {
            sourcemaps: false,
        })
        .pipe(
            sass({
                outputStyle: 'expanded',
                sourceComments: true,
                precision: 10,
                includePaths: bourbon,
            }).on('error', sass.logError)
        )
        .pipe(postcss(processors))
        .pipe(minifycss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./', { sourcemaps: false }));
}

// Post CSS options, used above
const processors = [
    autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie > 8'],
    }),
    pxtorem({
        root_value: 10,
        prop_white_list: [],
        replace: false,
    }),
];

/**
 * Compile JS - combine all the js src files, make it all.min.js,
 * minify it, and then spit it out in a new folder.
 */
function compileScripts() {
    return gulp
        .src(
            [
                'assets/js/src/modernizr.js',
                'assets/js/src/jquery.easing.1.3.js',
                'assets/js/src/jquery.ba-throttle-debounce.js',
                'assets/js/src/fastclick.js',
                'assets/js/src/respimage.js',
                'assets/js/src/firefox.picturefill.js',
                'assets/js/src/superfish.js',
                'assets/js/src/jquery.hoverIntent.js',
                'assets/js/src/slick.js',
                'assets/js/src/magnific.js',
                'assets/js/src/jquery.placeholder.js',
                'assets/js/src/custom-scripts.js',
            ],
            { sourcemaps: false }
        )
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js', { sourcemaps: false }));
}

/**
 * Compile JS #2 - just like above, but with different files. This compiled JS file
 * will be included in the footer of the site instead of the head.
 * If you ever have JS that needs to be included more/less often, you can always create a new compile function
 * to process it.
 */
// function compileFooterScripts() {
//     return gulp
//         .src(
//             [
//                 'assets/js/src/custom-footer.js',
//             ],
//             { sourcemaps: false }
//         )
//         .pipe(babel({ presets: ['@babel/env'] }))
//         .pipe(concat('ftr.js'))
//         .pipe(rename('ftr.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('assets/js', { sourcemaps: false }));
// }

// function compileMenuDropdownScripts() {
//     return gulp
//         .src(['assets/js/src/custom-menu-dropdown.js'], { sourcemaps: false })
//         .pipe(babel({ presets: ['@babel/env'] }))
//         .pipe(concat('mdd.js'))
//         .pipe(rename('mdd.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('assets/js', { sourcemaps: false }));
// }

// function compileMenuSliderScripts() {
//     return gulp
//         .src(['assets/js/src/custom-menu-slide.js'], { sourcemaps: false })
//         .pipe(babel({ presets: ['@babel/env'] }))
//         .pipe(concat('msl.js'))
//         .pipe(rename('msl.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('assets/js', { sourcemaps: false }));
// }

/**
 *
 * Process all images in assets/images and copies the results into assets/images/minified
 * Simply adding a new image to the
 */
/*
function minifyImages() {
    const maxWidth = 1200;
    return (
        gulp
            .src(
                [
                    'assets/images/content/*.{png,jpg}'
                ]
            )
            .pipe(
                squoosh((src) => {
                    // The file types we are looking to optimize

                    let options = {
                        encodeOptions: {
                            oxipng: 'auto',
                            mozjpg: 'auto',
                        },
                    }

                    // Resize any images larger than 1200px
                    if(src.width > maxWidth) {
                        options = {
                            ...options,
                            preprocessOptions: {
                                resize: {
                                enabled: true,
                                width: maxWidth,
                                },
                            },
                        }
                    }

                    return options;
                })
            )
            .pipe(gulp.dest('assets/images/content/minified'))
    )
}*/

/**
 * Watch all the necesary files,
 * and then run the functions created above whenever one of their files change.
 */
function watch() {
    gulp.watch('assets/js/src/*.js', lintScripts);
    gulp.watch(['assets/js/src/*.js'], compileScripts);
    gulp.watch(
        [
            'assets/scss/**/**/**/*.scss',
            'template-parts/modules/**/assets/scss/*.scss',
        ],
        compileSass
    );
}

/**
 * This let's you run the functions above from the commandline, but all I ever do is type "gulp"
 * which will run the default "watch"
 * which in turn does everything else automatically until we cancel it in the terminal.
 */
exports.watch = watch;
exports.js = compileScripts;
exports.sass = compileSass;

gulp.task('default', watch);
//gulp.task('images', minifyImages);
