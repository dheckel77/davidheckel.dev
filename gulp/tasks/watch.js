var {src, dest, task, series, parallel} = require('gulp');
var watch = require('gulp-watch');
var	browserSync = require('browser-sync').create();

function watch(cb) {

	browserSync.init({
		notify: false,
		server: {
			baseDir: "/"
		}
	});

	watch('./index.html', function () {
		browserSync.reload();
	});
	
	watch('./assets/styles/**/*.css', function() {
		gulp.start('cssInject');
	});

	watch('./assets/scripts/**/*.js', function () {
		gulp.start('scriptsRefresh');
	});
	cb();
};

task('cssInject', ['styles'], function () {
	return gulp.src('./temp/styles/styles.css')
		.pipe(browserSync.stream());
});

task('scriptsRefresh', ['scripts'], function () {
	browserSync.reload();
});
