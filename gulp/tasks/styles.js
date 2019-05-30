const gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('gulp-autoprefixer'),
	cssvars = require('postcss-simple-vars'),
	cssnano = require('gulp-cssnano'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	mixins = require('postcss-mixins'),
	hexrgba = require('postcss-hexrgba'),
	sourcemaps = require('gulp-sourcemaps'),
	browsersync = require('browser-sync')

// function styles(cb) {
// 	src('./assets/styles/styles.css')
// 		.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
// 		.on('error', console.error.bind(console))
// 		.pipe(dest('./temp/styles'));
// 	cb();
// };

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