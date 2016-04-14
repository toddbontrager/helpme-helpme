var gulp = require('gulp');
var sync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy: true});


var paths = {
  // all our client app js files, not including 3rd party js files or any existing dist files
  scripts: ['client/app/**/*.js', '!client/lib/**/*.js', '!client/dist/*.js'],
  server: ['server/**/*.js'],
  html: ['client/app/**/*.html', 'client/index.html'],
  css: ['client/assets/css/style.css'],
  test: ['specs/**/*.js']
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.server))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'));
});

gulp.task('optimise', function() {
  return gulp.src(paths.scripts)
      .pipe($.sourcemaps.init())
      .pipe($.concat('app.js'))
      .pipe(gulp.dest('./client/dist'))
      .pipe($.rename('app.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./client/dist'))
      .on('error', function(err) {
        console.error(err);
      });
});

// nodemon equivalent for browser
gulp.task('sync', function () {
  sync.init({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.css),
    proxy: 'localhost:3000',
    port: 5000
  });
});


// Tasks 'fonts', 'bootstrap', and 'sass' for setting up bootstrap-sass and sass compiling
var config = {
  assetDir: './client/assets',
  bowerDir: './client/lib'
};

gulp.task('fonts', function() {
  return gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest(config.assetDir + '/fonts'));
});

gulp.task('bootstrap', function() {
  return gulp.src([
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js',
  ])
  .pipe($.sourcemaps.init())
  .pipe($.concat('bootstrap.js'))
  .pipe($.uglify())
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(config.assetDir + '/js'));
});

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('sass', function() {
  return gulp.src(config.assetDir + '/sass/style.scss')
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'compressed',
        includePaths: [config.bowerDir + '/bootstrap-sass/assets/stylesheets'],
      })
      .on('error', $.sass.logError)
    )
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.assetDir + '/css'));
});


// start our node server using nodemon
gulp.task('nodemon', function (cb) {
  var called = false;

  var nodeOptions = {
    script: './server/server.js',
    delayTime: 1,
    ignore: [
      'Gulpfile.js',
      'node_modules/**/*.js'
    ]
  };

  return $.nodemon(nodeOptions)
      .on('start', function () {
          if (!called) {
            called = true;
            cb();
          }
        })
        .on('restart', function () {
          setTimeout(function () {
            sync.reload({ stream: false });
          }, 1000);
        });
});

gulp.task('default', ['sass', 'bootstrap', 'fonts', 'nodemon', 'sync']);

gulp.task('deploy', [/*'lint',*/ /*'test',*/ 'optimise']);