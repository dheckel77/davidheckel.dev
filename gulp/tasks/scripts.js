var gulp = require('gulp');
var	webpack = require('webpack');

function scripts(cb) {
	webpack(require('../../webpack.config'), function (err, stats) {
		if (err) {
			console.log(err.toString());
		}
		console.log(stats.toString());
		cb();
	});
};