'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
const flatmap = require('gulp-flatmap');
const path = require('path');

gulp.task('delete', function () {
    return del(['images_import/**', '!images_import']);
});

gulp.task('resize-images', function () {
    return gulp.src('images_import/**/*.*')
        .pipe(flatmap(function(stream, file) {
            const relativePath = path.relative(file.base, file.path);
            const destPathFulls = path.join('images/fulls', relativePath);
            const destPathThumbs = path.join('images/thumbs', relativePath);

            return gulp.src(file.path)
                .pipe(imageResize({
                    width: 1024,
                    imageMagick: true
                }))
                .pipe(gulp.dest(path.dirname(destPathFulls)))
                .pipe(imageResize({
                    width: 512,
                    imageMagick: true
                }))
                .pipe(gulp.dest(path.dirname(destPathThumbs)));
        }));
});

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('./assets/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/css'));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', function () {
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

// minify js
gulp.task('minify-js', function () {
    return gulp.src('./assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/js'));
});

// build task
gulp.task('build', gulp.series('sass', 'minify-js'));

// resize images
gulp.task('resize', gulp.series('resize-images', 'delete'));

// default task
gulp.task('default', gulp.series('build', 'resize'));
