/**
 * Created by ivan on 5/07/15.
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var routes = {
    srcJs: './js/**/*.js',
    srcCss: './css/**/*.css',
    srcHtml: './index.html'
};

gulp.task('scripts', function(){
    var sources = gulp.src(['./js/**/*.js', '!./js/**/*.spec.js', '!./js/response.js']);
    return sources
        .pipe(gulp.dest('./build/app'));
});

gulp.task('css', function(){
    return gulp.src(['./css/**/*.css'])
        .pipe(gulp.dest('./build/assets/'));
});

gulp.task('install', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(plugins.install());
});
gulp.task('vendor-scripts', ['install'], function() {
    return gulp.src(wiredep.js)
        .pipe(gulp.dest('build/vendor'));

});

gulp.task('vendor-css', ['install'], function() {
    return gulp.src(wiredep.css)
        .pipe(gulp.dest('build/vendor'));

});

gulp.task('index', ['scripts', 'css'], function() {
    return gulp.src('./index.html')
        .pipe(wiredep({
            fileTypes: {
                html: {
                    replace: {
                        js: function(filePath) {
                            return '<script src="' + 'build/vendor/' + filePath.split('/').pop() + '"></script>';
                        },
                        css: function(filePath) {
                            return '<link rel="stylesheet" href="' + 'build/vendor/' + filePath.split('/').pop() + '"/>';
                        }
                    }
                }
            }
        }))

        .pipe(plugins.inject(
            gulp.src(['build/app/**/*.js'], { read: false }), {
                addRootSlash: false,
                transform: function(filePath, file, i, length) {
                    return '<script src="' + filePath + '"></script>';
                }
            }))

        .pipe(plugins.inject(
            gulp.src(['build/assets/**/*.css'], { read: false }), {
                addRootSlash: false,
                transform: function(filePath, file, i, length) {
                    return '<link rel="stylesheet" href="' + filePath + '"/>';
                }
            }))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function(){
    gulp.watch(routes.srcJs, ['index']);
    gulp.watch(routes.srcCss, ['index']);
    gulp.watch(routes.srcHtml, ['index']);
});

gulp.task('default', ['index', 'watch']);