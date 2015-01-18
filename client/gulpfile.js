var gulp = require('gulp'),
    $ = {};


$.connect = require('gulp-connect');
$.open = require('gulp-open');

var config = {
    port: 8888
}

gulp.task('serve', function() {
    $.connect.server({
        port: config.port,
        root: 'app',
        livereload: true
    });

    gulp.src('./app/index.html')
        .pipe($.open('', {
            app: "chrome",
            url: 'http://localhost:' + config.port
        }));
});
