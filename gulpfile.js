//  *************************************
//
//  Gulpfile
//
//  *************************************
//
//  Available tasks:
//  'gulp'
//  'gulp list'
//  'gulp lint:js'
//  'gulp bundle:js'
//  'gulp watch:js'
//  'gulp serve'
//
//  *************************************



//  -------------------------------------
//  Modules
//  -------------------------------------
//
//  gulp                    :  The streaming build system
//  gulp-autoprefixer				:  Prefix CSS with Autoprefixer
//  gulp-load-plugins       :  Automatically load Gulp plugins
//  gulp-cached             :  A simple in-memory file cache for gulp
//  gulp-eslint             :  The pluggable linting utility for JavaScript and JSX
//  gulp-jade								:  Compile Jade templates
//  gulp-jscs               :  JS code style linter
//  gulp-jscs-stylish       :  A reporter for the JSCS
//  gulp-plumber            :  Prevent pipe breaking caused by errors from gulp plugins
//  gulp-rucksack						:  A little bag of CSS superpowers
//  gulp-sourcemaps         :  Source map support for Gulp.js
//  gulp-task-listing       :  Task listing for your gulpfile
//  gulp-using              :  Lists all files used
//  gulp-util               :  Utility functions for gulp plugins
//  gulp-sass								:  Something like this will compile your Sass files
//  react                   :  A JavaScript library for building user interfaces
//  reactify                :  Browserify transform for JSX
//  vinyl-buffer            :  Convert streaming vinyl files to use buffers
//  vinyl-source-stream     :  Use conventional text streams at the start
//  babel-eslint            :  Lint ALL valid Babel code with ESlint
//  babelify                :  Babel browserify transform
//  browser-sync            :  Live CSS Reload & Browser Syncing
//  browserify              :  Browser-side require() the node way
//  eslint-config-airbnb    :  Airbnb's ESLint config, following our styleguide
//  eslint-plugin-react     :  React specific linting rules for ESLint
//
// -------------------------------------



//  -------------------------------------
//  Require gulp module
//  -------------------------------------
//
//  gulp core modules
var gulp = require('gulp');
var config = require('./gulp_config');
var $ = require('gulp-load-plugins')({lazy: true});
//
//  browserify related modules
var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//
//  browser-sync module
var browserSync = require('browser-sync').create();
//
//	wiredep
var wiredep = require('wiredep').stream;
//
//  image compression
var pngquant = require('imagemin-pngquant');
//
//
//  -------------------------------------



//  -------------------------------------
//  Utility function
//  -------------------------------------
//
function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.bgYellow.white(msg[item]));
			}
		}
	}
	else {
		$.util.log($.util.colors.underline.bold.bgBlue(msg));
	}
}
//
//  -------------------------------------


//  -------------------------------------
//  Task: list
//  -------------------------------------
//
gulp.task('list', function() {
	log('list all tasks registered');
	$.taskListing();
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: build
//  -------------------------------------
//
gulp.task('build', ['bundle:js', 'compile:css', 'compile:html', 'compress:image', 'copy:font', 'copy:js']);
//
//  -------------------------------------



//  -------------------------------------
//  Task: lint:js
//  -------------------------------------
//
gulp.task('lint:js', function(){
	log('ESlint and JSCS examination task');
	return gulp
		.src(config.src.js)
		.pipe($.cached('linting'))
		.pipe($.plumber())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.using({
		  prefix: 'lint:js',
		  color: 'yellow'
		}));
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: bundle:js
//  -------------------------------------
//
gulp.task('bundle:js',['lint:js'] ,function(){
	log('browserify js bundling task');
	browserify({
	    entries: [config.src.collectionJs],
	    transform: [babelify],
	    extension: ['jsx', 'js'],
	    debug: true
	})
	.bundle()
	.on('error', console.error.bind(console))
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe($.sourcemaps.init({loadMaps: true}))
	.pipe($.sourcemaps.write('./maps'))
	.pipe($.using({
	  prefix: 'bundle:js',
	  color: 'yellow'
	}))
	.pipe(gulp.dest(config.build.js))
	.pipe(browserSync.stream());
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: copy:js
//  -------------------------------------
//
gulp.task('copy:js', function () {
  log('Coping js to build directory');
  return gulp
    .src(config.src.mainjs, { base: './src' })
    .pipe($.plumber())
    .pipe($.using({
      prefix: 'copy:font',
      color: 'yellow'
    }))
    .pipe(gulp.dest(config.build.dir))
		.pipe(browserSync.stream());
});
//
//  -------------------------------------


//  -------------------------------------
//  Task: watch:js
//  -------------------------------------
//
gulp.task('watch:js', ['bundle:js'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: compile:css
//  -------------------------------------
//
gulp.task('compile:css', function () {
    log('Compiling Sass --> CSS');
    return gulp
    .src(config.src.sass)
		.pipe($.cached('compile:css'))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
		.pipe($.using({
    prefix: 'compile:css',
	    color: 'yellow'
	  }))
    .pipe($.sass({
    	indentedSyntax: true
		}))
		.pipe($.rucksack({
			autoprefixer: true
		}))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.build.css))
    .pipe(browserSync.stream());
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: watch:css
//  -------------------------------------
//
gulp.task('watch:css', ['compile:css'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: compile:html
//  -------------------------------------
//
gulp.task('compile:html', ['wiredep', 'injection'], function () {
	log('Compiling Jade --> HTML');
	return gulp
		.src(config.src.template)
		.pipe($.cached('compile:html'))
		.pipe($.plumber())
		.pipe($.using({
			prefix: 'compile:html',
			color: 'yellow'
		}))
		.pipe($.jade({
		  pretty: true
		}))
		.pipe(gulp.dest(config.build.html))
		.pipe(browserSync.stream());
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: wiredep
//  -------------------------------------
//
gulp.task('wiredep', function () {
  log('wiredep is processing');
  return gulp
    .src(config.src.dir + 'index.jade')
    .pipe(wiredep({
      ignorePath: '../build'
    }))
    .pipe(gulp.dest(config.src.dir))
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: watch:html
//  -------------------------------------
//
gulp.task('watch:html', ['compile:html'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: compress:image
//  -------------------------------------
//
gulp.task('compress:image', function () {
  log('Optimize images');
  return gulp
    .src(config.src.assets.img, { base: './src' })
    .pipe($.using({
      prefix: 'compress:image',
      color: 'yellow'
    }))
		.pipe($.imagemin({
			progressive: true,
      interlaced: true,
      multipass: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(config.build.dir))
		.pipe(browserSync.stream());
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: copy:font
//  -------------------------------------
//
gulp.task('copy:font', function () {
  log('Coping fonts to build directory');
  return gulp
    .src(config.src.assets.font, { base: './src' })
    .pipe($.plumber())
    .pipe($.using({
      prefix: 'copy:font',
      color: 'yellow'
    }))
    .pipe(gulp.dest(config.build.dir))
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: injection
//  -------------------------------------
//
gulp.task('injection', function () {
  log('Injection');
	var target = gulp.src(config.src.dir + 'index.jade');
	var sources = gulp.src(['./src/js/main.js'], {read: false});
  return target
    .pipe($.plumber())
    .pipe($.using({
      prefix: 'injection',
      color: 'yellow'
    }))
		.pipe($.inject(sources, {
			relative: true
		}))
    .pipe(gulp.dest(config.src.dir));
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: serve
//  -------------------------------------
//
gulp.task('serve',['build'] ,function() {

    log('browser-sync starts');

    browserSync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch([config.src.js, '!' + config.src.mainjs], ['watch:js']);
		gulp.watch(config.src.sass, ['watch:css']);
		gulp.watch(config.src.template, ['watch:html']);
		gulp.watch(config.src.mainjs, ['copy:js']);

});
//  -------------------------------------



//  -------------------------------------
//  Task: default
//  -------------------------------------
//
gulp.task('default', ['list', 'serve']);
//
//  -------------------------------------
