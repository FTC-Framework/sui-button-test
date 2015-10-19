var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    cp = require('child_process'),
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    beep = require('beepbeep'),
    colors = require('colors'),
    sass = require('gulp-sass');


var basePath = {
  src: '.',
  dist: './dist'
};

// ERROR HANDLER ==============================================================
  var onError = function(err) {
    beep([200, 200]);
    console.log(
      '\n*****************'.bold.gray + ' \\(°□°)/ '.bold.red + '<( ERROR! ) '.bold.blue + '*****************\n\n'.bold.gray +
      String(err) +
      '\n*******************************************************\n'.bold.gray );
    browsersync.notify(String(err), 5000);
    this.emit('end');
  };


  // CLEAN ======================================================================
  gulp.task('clean', function(callback) {
    return del([
		basePath.dist
      ],function(err, deletedFiles) {
      console.log('Files deleted:\n'.bold.green , deletedFiles.join(',\n '));
      callback();
    });
  });


// STYLES =====================================================================
   gulp.task('css', function() {
    return gulp.src( basePath.src + '/*.scss' )
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(sass())
      .pipe(gulp.dest( basePath.dist ));
  });


// HTML =====================================================================
	gulp.task('html', function(){
		return gulp.src( basePath.src + '/*.html' )
			.pipe(gulp.dest( basePath.dist ));
	});


// BROWSER SYNC ===============================================================
  gulp.task('browsersync', function() {
    browsersync({
      server: { baseDir: basePath.dist },
      port: 8000,
      files: [
        basePath.dist + '/*.css',
        basePath.dist + '/*.html'
      ]
    });
  });

// WATCH ======================================================================
  gulp.task('watch', ['browsersync'], function() {
    gulp.watch( basePath.src + '/**/*.scss', ['css'] );
    gulp.watch( basePath.src + '/*.html', ['html'] );
  });


// BUILD ======================================================================
  gulp.task('build', function(callback) {
    runSequence(
      'clean',
      [
        'css',
        'html'
      ],
    callback);
  });

  gulp.task('default', function(callback) {
    runSequence(
      'build',
      ['watch'],
      callback);
  });