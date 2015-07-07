'use strict';
// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp = require('gulp');

var karma = require('karma').server;
var open = require('open');
var wiredep = require('wiredep').stream;

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
    gulp.task('styles', function () {
        return $.rubySass('./styles/main.scss', {
                style: 'expanded',
                loadPath: ['bower_components']
            })
            .pipe($.autoprefixer('last 1 version'))
            .pipe(gulp.dest('./build/styles'))
            .pipe($.size());
    });

// Scripts
gulp.task('scripts', function () {
    return gulp.src('./js/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe(gulp.dest('./build/js'))
        .pipe($.size());
});

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('./*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        //.pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('build'))
        .pipe($.size());
});

// img
gulp.task('img', function () {
    return gulp.src('./img/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('build/img'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['build/styles', 'build/js', 'build/img'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['html', 'img']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


// Inject Bower components
gulp.task('wiredep', function () {
    var appSources = gulp.src(['build/js/**/*.js', 'build/styles/**/*.css'], {read: false});
    gulp.src('./styles/*.scss')
        .pipe(wiredep({
            directory: './bower_components',
            ignorePath: './bower_components/'
        }))
        .pipe(gulp.dest('./build/styles'));

    gulp.src('./*.html')
        .pipe(wiredep({
            directory: './bower_components',
            ignorePath: './'
        }))
        .pipe($.inject(appSources))
        .pipe(gulp.dest('build'));
});

// Watch
gulp.task('watch', function () {
    // Watch for changes in `app` folder

    gulp.watch('./styles/**/*.scss', ['styles']);

    gulp.watch('./js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('./img/**/*', ['img']);

    // Watch bower files
    gulp.watch('bower.json', ['wiredep']);
});


gulp.task('test', function(done){
    karma.start({
        configFile: __dirname+'/karma.conf.js',
        singleRun: true
    }, done);
});
