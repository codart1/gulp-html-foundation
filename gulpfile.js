var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade');
var less = require('gulp-less');

var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoPrefix = new LessPluginAutoPrefix({ browsers: ["last 20 versions"] });
var connect = require('gulp-connect');
var changed = require('gulp-changed');

// Static Server + watching scss/html files, sync all stuffs
gulp.task('serve', ['jade', 'less'], function() {

    browserSync.init({
        server: {
            baseDir: "./dist/html",
            directory: true,
            routes: {
                "/assets": "./dist/assets"
            }
        },

        files: [
            './dist/html/**/*.html',
            './dist/assets/css/**/*.css',
            './dist/assets/js/**/*.js',
        ],

        ui: {
            port: 5500
        },

    });

});

// Static server without watching
gulp.task('connect', function() {
  connect.server({
    root: ['./dist/html', './dist'],
    port: 80,
  });
});

// Watch
gulp.task('watch', ['jade', 'less'], function() {
  gulp.watch("./src/jade/**/*.jade", ['jade']);
  gulp.watch("./src/less/**/*.less", ['less']);
});

// Jade
gulp.task('jade', function() {
  var src = [
    './src/jade/**/*.jade',
    '!./src/jade/**/layouts/*.jade',
    '!./src/jade/**/includes/*.jade',
  ];

  var dest = './dist/html';

    gulp.src(src)
        .pipe(changed(dest))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(dest))
});

// Less
gulp.task('less', function() {
    var src = [
      './src/less/**/*.less',
      '!./src/less/**/includes/*.less',
    ];

    var dest = './dist/assets/css';

    gulp.src(src)
        .pipe(changed(dest))
        .pipe(less({
            paths: ['./src/less/**/includes'],
            plugins: [autoPrefix],
        }))
        .pipe(gulp.dest(dest));
});


gulp.task('default', ['jade', 'less', 'serve', 'watch']);
gulp.task('ss', ['jade', 'less', 'connect', 'watch']);
