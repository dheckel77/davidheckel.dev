// import './gulp/tasks/sprites';

const gulp = require("gulp"),
	postcss = require('gulp-postcss'),
	plumber = require('gulp-plumber'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
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
	css: {
		src: "./assets/css/**/*.css",
		dest: "./assets/dist/css/"
	},
	scripts: {
		src: "./assets/scripts/**/App.js",
		dest: "./assets/dist/scripts/"
	},
};

function clean() {
	return del(['./assets/dist/css/**/*']),
		del(['./assets/dist/scripts/**/*']);
}

function css() {
	return gulp
		.src(paths.css.src)
		.pipe(plumber())
		// .pipe(sourcemaps.init({loadMaps: true}))
		.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba]))
		.pipe(autoprefixer('last 2 versions'))
		// .pipe(sourcemaps.write())
		// .pipe(uglify())
		// .pipe(lineec())
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browsersync.stream()); 
}

function scripts() {
	return gulp
		.src(paths.scripts.src)
		// .pipe(uglify())
		// .pipe(lineec())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(browsersync.stream());
}

function browserSyncReload(done) {
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

function watchFiles() {
  gulp.watch("./assets/styles/**/*", css);
  gulp.watch("./assets/scripts/**/*", scripts);
	// gulp.watch("./assets/images/**/*", images);
	gulp.watch("./assets/index.html", browserSyncReload);
}


const build = gulp.series(clean, gulp.parallel(css, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

exports.clean = clean;
exports.css = css;
exports.scripts = scripts;
exports.build =build;
exports.watch = watch;
exports.default = build;
