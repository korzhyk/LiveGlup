var fs         = require('fs');
var path       = require('path');
var nib        = require('nib');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var coffee     = require('gulp-coffee');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var jade       = require('gulp-jade');
var stylus     = require('gulp-stylus');
var imagemin   = require('gulp-imagemin');
var exec       = require('gulp-exec');
var livereload = require('gulp-livereload');
var plumber    = require('gulp-plumber');

var port = process.env.PORT || 5000;

var paths = {
  dest: 'build',
  js: ['src/js/**/**'],
  images: 'src/images/**/**',
  css: ['src/css/**/*.styl', '!src/css/**/_*.styl'],
  jade: 'src/*.jade',
  vendor: 'src/vendor/**/**'
};

gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
    .pipe(gulp.dest(paths.dest + '/vendor'))
    .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest(paths.dest + '/js'))
    .pipe(livereload());
});

gulp.task('images', function() {
 return gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(paths.dest + '/images'))
    .pipe(livereload());
});

gulp.task('css', function () {
  gulp.src(paths.css)
    .pipe(plumber())
    .pipe(stylus({ use: nib(), import: 'nib' }))
    .pipe(gulp.dest(paths.dest + '/css'))
    .pipe(livereload());
});

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(paths.dest))
    .pipe(livereload());
});

gulp.task('connect', function(next) {
  var connect = require('connect');
  var server = connect()
  var static = require('serve-static');

  server
    .use(static(paths.dest))
    .listen(port, function(){
      gutil.log('Connect listen on', port);
      next();
    });
});

// Rerun the task when a file changes
gulp.task('watch', ['connect'], function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.vendor, ['vendor']);

  livereload.listen();
});

gulp.task('default', ['images', 'vendor', 'js', 'css', 'jade', 'watch']);