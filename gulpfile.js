var gulp       = require('gulp')
  , gutil      = require('gulp-util')
  , coffee     = require('gulp-coffee')
  , concat     = require('gulp-concat')
  , uglify     = require('gulp-uglify')
  , jade       = require('gulp-jade')
  , stylus     = require('gulp-stylus')
  , imagemin   = require('gulp-imagemin')
  , exec       = require('gulp-exec')
  , livereload = require('gulp-livereload')
  , plumber    = require('gulp-plumber');

var nib = require('nib');

var port = process.env.PORT || 5000;

var paths = {
  dest: 'build',
  js: ['src/js/**/*.coffee'],
  images: 'src/img/**/*.{jpg,png,gif,svg}',
  css: ['src/css/**/*.styl', '!src/css/**/_*.styl'],
  jade: 'src/*.jade',
  vendor: 'src/vendor/**/**'
};

gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
    .pipe(gulp.dest(paths.dest + '/vendor'));
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('images', function() {
 return gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(paths.dest + '/img'));
});

gulp.task('css', function () {
  gulp.src(paths.css)
    .pipe(plumber())
    .pipe(stylus({ use: ['nib'], import: ['nib'] })).on('error', gutil.log)
    .pipe(gulp.dest(paths.dest + '/css'));
});

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(jade({ pretty: true }).on('error', gutil.log))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('connect', function(next) {
  var connect = require('connect')
    , fs = require('fs')
    , path = require('path')
    , server = connect();
  server.use(connect.static(paths.dest)).listen(port, function(){
    gutil.log('Connect listen on', port);
    next();
  });
  server.use('/', function(req, res, next){
    var file = paths.dest + '/' + (req._parsedUrl.pathname.slice(1) || 'index') + '.html';
    fs.createReadStream(file).on('error', next).pipe(res);
  });
  server.use(function(err, req, res, next){ res.statusCode = 404; res.end(); })
});

// Rerun the task when a file changes
gulp.task('watch', ['connect'], function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.vendor, ['vendor']);

  var server = livereload();
  gulp.watch(paths.dest + '/**').on('change', function(file) {
      server.changed(file.path);
  });
});

gulp.task('default', ['images', 'vendor', 'js', 'css', 'jade', 'watch']);