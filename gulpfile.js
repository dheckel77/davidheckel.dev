const gulp = require("gulp"),
	postcss = require('gulp-postcss'),
	plumber = require('gulp-plumber'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	usemin = require('gulp-usemin'),
	imagemin = require('gulp-imagemin'),
	modernizr = require('gulp-modernizr');
	changed = require('gulp-changed'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),
	rev = require('gulp-rev'),
	htmlmin = require('gulp-htmlmin'),	
	lec = require('gulp-line-ending-corrector'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('cssnano'),
	cssvars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	mixins = require('postcss-mixins'),
	hexrgba = require('postcss-hexrgba'),
	browsersync = require('browser-sync').create(),
	webpack = require("webpack"),
	webpackstream = require("webpack-stream"),
	webpackconfig = require("./webpack.config.js")

var paths = {
	styles: {
		src: "./app/assets/styles/styles.css",
		dest: "./app/temp/styles/"
	},
	scripts: {
		src: "./app/assets/scripts/App.js",
		dest: "./app/temp/scripts/"
	},
	images: {
		src: "./app/assets/images/**/*",
		dest: "./docs/assets/images/"
	},
};

function previewDist(done) {
	browsersync.init({
		server: {
			baseDir: "docs",
			injectChanges: true
		}
	});
	done();
}

function clean() {
	return del(['./docs/**/*'])
}

function copyGeneralFiles() {
	let pathsToCopy = [
		'./app/**/*',
		'!./app/index.html',
		'!./app/assets/images/**',
		'!./app/assets/styles/**',
		'!./app/assets/scripts/**',
		'!./app/temp',
		'!./app/temp/**'
	]
	return gulp
		.src(pathsToCopy)
		.pipe(gulp.dest("./docs"));
}

// require('./gulp/tasks/scripts');
// require('./gulp/tasks/styles');
// require('./gulp/tasks/watch');
// require('./gulp/tasks/sprites');

function styles() {
	return gulp
		.src(paths.styles.src)
		// .pipe(plumber())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(postcss([cssImport, mixins, cssnano, cssvars, nested, hexrgba]))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browsersync.stream())
		.pipe(notify("Styles built"));
}

function scripts(done) {
  webpack(require('./webpack.config'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
		console.log(stats.toString());
    done();
  });
}

function optimizeImages() {
	return gulp
		.src([paths.images.src])
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			multipass: true
		}))
		.pipe(gulp.dest(paths.images.dest));
}

function useminHTML() {
	return gulp
		.src("./app/index.html")
		.pipe(usemin({
			css: [ rev()],
			js: [function() {return rev()}, function() {return uglify()}],
			html: [htmlmin({ collapseWhitespace: true })],
			inlinecss: [cleanCSS(), 'concat']
		}))
		.pipe(gulp.dest("./docs"));
}

function modernizR() {
	return gulp.src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
		.pipe(modernizr({
			"options": [
				"setClasses"
			]
		}))
		.pipe(gulp.dest('./app/assets/scripts/'));
}

function reload(done) {
	browsersync.reload();
	done();
}

function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "app",
			injectChanges: true
		}
	});
	done();
}

function watchFiles() {
  gulp.watch("./app/assets/styles/**/*.css", styles);
  gulp.watch("./app/assets/scripts/**/*.js", scripts);
	gulp.watch("./app/assets/images/**/*.{jpg, png}", optimizeImages);
	var html = gulp.watch('./app/index.html');
  html.on('change', function(path, stats) {
    console.log('you changed the html');
    browsersync.notify("Compiling, please wait!");
    browsersync.reload("index.html");
  })
}

const build = gulp.series(clean, copyGeneralFiles, modernizR, optimizeImages, useminHTML);
const watch = gulp.parallel(watchFiles, browserSync);

exports.reload = reload;
exports.clean = clean;
exports.copyGeneralFiles = copyGeneralFiles;
exports.styles = styles;
exports.scripts = scripts;
exports.optimizeImages = optimizeImages;
exports.useminHTML = useminHTML;
exports.modernizR = modernizR;
exports.previewDist = previewDist;
exports.build =build;
exports.watch = watch;
exports.default = build;
