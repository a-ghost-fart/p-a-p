var gulp = require('gulp');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var dest = './public/';

gulp.task('build:js', function () {
    'use strict';

    return gulp.src('./src/js/main.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(rename('bundled.js'))
        .pipe(gulp.dest(dest + 'js/'));
});

gulp.task('build:scss', function () {
    'use strict';

    return gulp.src('./src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('default', function () {
    'use strict';

    gulp.watch('./src/js/**/*.js', ['build:js']);
    gulp.watch('./src/scss/**/*.scss', ['build:scss']);
});
