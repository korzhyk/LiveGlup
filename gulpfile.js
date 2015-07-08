var fs         = require('fs');
var path       = require('path');
var nib        = require('nib');
var jeet       = require('jeet');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var coffee     = require('gulp-coffee');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var jade       = require('gulp-jade');
var stylus     = require('gulp-stylus');
var imagemin   = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var plumber    = require('gulp-plumber');
var mkdirp     = require('mkdirp');
var exec       = require('child_process').exec;

var port = process.env.PORT || 5000;

var paths = {
  dest: 'build',
  js: ['src/js/**/**'],
  images: 'src/images/**/**',
  css: ['src/css/**/*.styl', '!src/css/**/_*.styl'],
  jade: ['src/**/*.jade', '!src/**/_*.jade'],
  bower: 'src/bower_components/**/**'
};

gulp.task('bower', function() {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(paths.dest + '/bower_components'))
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
    .pipe(stylus({ use: [nib(), jeet()], import: ['nib', 'jeet'] }))
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

gulp.task('connect', ['images', 'bower', 'js', 'css', 'jade'], function(next) {
  var http = require('http');
  var finalhandler = require('finalhandler');
  var serveStatic = require('serve-static');
  
  // Serve up public folder
  var serve = serveStatic(paths.dest, { 'index': ['index.html', 'index.htm'] })
  
  // Create server
  var server = http.createServer(function(req, res){
    var done = finalhandler(req, res)
    serve(req, res, done)
  })

  // Listen
  server.listen(port, function(){
    gutil.log('http server listen on', port);
    next();
  });
});

gulp.task('mkdirs', function() {
  mkdirp.sync('./src/css');
  mkdirp.sync('./src/js');
  mkdirp.sync('./src/images');
  mkdirp.sync('./src/bower_components');
});

// Rerun the task when a file changes
gulp.task('watch', ['mkdirs', 'connect'], function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.bower, ['bower']);

  livereload.listen();
  exec("echo 'Opening browser!' && open http://localhost:" + port);
});

gulp.task('default', ['watch']);
