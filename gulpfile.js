var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var jade        = require('gulp-jade');

// Static Server + watching scss/html files
gulp.task('serve', ['jade'], function() {

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
		}
    });

    gulp.watch("./src/jade/**/*.jade", ['jade']);
});

 
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
 
  gulp.src([
  		'./src/jade/**/*.jade',
  		'!./src/jade/**/layouts/*.jade',
  		'!./src/jade/**/includes/*.jade',
	])
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/html'))
});


gulp.task('default', ['jade', 'serve']);