var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade');
var less = require('gulp-less');

var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoPrefix = new LessPluginAutoPrefix({ browsers: ["last 20 versions"] });
var connect = require('gulp-connect');
var changed = require('gulp-changed');

var watch = require('gulp-watch');
var jadeInheritance = require('gulp-jade-inheritance');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');

var filter = require('gulp-filter');

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

// Static Server + watching scss/html files, sync all stuffs
gulp.task('serve', ['jade', 'less'], function() {

    browserSync.init({
        server: {
            baseDir: "./dist/html",
            directory: true,
            routes: {
                "/assets": "./dist/assets",
                "/libs": "./dist/libs"
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
gulp.task('watch', ['setWatch', 'jade', 'less'], function() {
  //gulp.watch("./src/jade/**/*.jade", ['jade']);
  //gulp.watch("./src/less/**/*.less", ['less']);

  watch('./src/jade/**/*.jade', function() { gulp.start('jade'); });
  watch('./src/less/**/*.less', function() { gulp.start('less'); });
  
});

// Jade
gulp.task('jade', function() {
  var src = './src/jade/**/*.jade';

  var dest = './dist/html';

    gulp.src(src)

        .pipe(changed(dest, {extension: '.html'}))

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('jade')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({basedir: './src/jade/'}))

        //filter out partials 
        .pipe(filter(function (file) {
            return !/layouts/.test(file.path) && !/includes/.test(file.relative);
        }))

        .pipe(jade({
            pretty: true
        }))

        .on('error', swallowError)
        .pipe(gulp.dest(dest))
});

//Set watch
gulp.task('setWatch', function() {
    global.isWatching = true;
});

// Jade process all
gulp.task('jade_process_all', function() {
  var src = [
    './src/jade/**/*.jade',
    '!./src/jade/**/layouts/*.jade',
    '!./src/jade/**/includes/*.jade',
  ];

  var dest = './dist/html';

    gulp.src(src)
        .pipe(jade({
            pretty: true
        }))
        .on('error', swallowError)
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
        .pipe(changed(dest, {extension: '.css'}))
        .pipe(less({
            paths: ['./src/less/**/includes'],
            plugins: [autoPrefix],
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(dest));
});


gulp.task('dist', ['jade_process_all', 'less']);
gulp.task('default', ['jade_process_all', 'less', 'serve', 'watch']);
gulp.task('ss', ['jade_process_all', 'less', 'connect', 'watch']);
