// import './gulp/tasks/sprites';

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
	lineec = require('gulp-line-ending-corrector'),
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
		src: "./assets/styles/styles.css",
		dest: "./dist/styles/"
	},
	scripts: {
		src: "./assets/scripts/**/App.js",
		dest: "./dist/scripts/"
	},
	images: {
		src: "'./assets/images/**.*', './assets/favicon/android-chrome-512x512.png', '!./assets/favicon/**/*'",
		dest: "./dist/images/"
	},
};

function clean() {
	return del(['./dist/**/*']);
}

function styles() {
	return gulp
		.src(paths.styles.src)
		// .pipe(plumber())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(postcss([cssImport, mixins, cssnano, cssvars, nested, hexrgba]))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browsersync.stream());
}

function scripts() {
	return gulp
		.src(paths.scripts.src)
		.pipe(uglify())
		.pipe(lineec())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(browsersync.stream());
}

function reload(done) {
	browsersync.reload();
	done();
}

function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "assets"
		}
	});
	done();
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
		.src("./assets/index.html")
    .pipe(usemin())
    .pipe(gulp.dest("./dist"));
}

function modernizR() {
  return gulp.src(['./assets/styles/**/*.css', './assets/scripts/**/*.js'])
    .pipe(modernizr({
      "options": [
        "setClasses"
      ]
    }))
    .pipe(gulp.dest('./assets/scripts/'));
}

function watchFiles() {
  gulp.watch("./assets/styles/**/*.css", styles);
  gulp.watch("./assets/scripts/**/*.js", scripts);
	gulp.watch("./assets/images/**/*.{jpg, png}", optimizeImages);
	gulp.watch("./assets/index.html", browsersync.reload());
}


const build = gulp.series(clean, modernizR, gulp.parallel(optimizeImages, useminHTML, styles, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

exports.reload = reload;
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.build =build;
exports.watch = watch;
exports.default = build;
