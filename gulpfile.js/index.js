const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');

const { bower, vendorJs } = require('./vendors');
const { opts } = require('./opts');
const data = require('../src/data/data.json');
const menu = require('../src/data/menu.json');

$.sass.compiler = require('node-sass');

gulp.task('clean', () => (
  gulp.src([
    './.tmp',
    './dist',
  ],
  {
    read: false,
    allowEmpty: true,
  })
    .pipe($.clean())
));

gulp.task('jade', () => (
  gulp.src('./src/**/!(_)*.jade')
    .pipe($.plumber())
    .pipe($.data(() => ({
      data,
      menu,
    })))
    .pipe($.jade({
      pretty: opts.env === 'develop',
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
));

gulp.task('sass', () => (
  gulp.src('./src/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: 'node_modules/bootstrap/scss',
    }).on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(opts.env === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
));

gulp.task('babel', () => (
  gulp.src('./src/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env'],
    }))
    .pipe($.concat('all.js'))
    .pipe($.if(opts.env === 'production', $.uglify({
      compress: {
        drop_console: true,
      },
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
));

gulp.task('imageMin', () => (
  gulp.src('./src/images/*')
    .pipe($.if(opts.env === 'production', $.imagemin()))
    .pipe(gulp.dest('./dist/images'))
));

gulp.task('deploy', () => (
  gulp.src('./dist/**/*')
    .pipe($.ghPages())
));

gulp.task('default',
  gulp.series(
    'clean',
    bower,
    vendorJs,
    gulp.parallel(
      'jade',
      'sass',
      'babel',
      'imageMin',
    ),
    (done) => {
      browserSync.init({
        server: {
          baseDir: './dist',
        },
      });

      gulp.watch('./src/**/*.jade', gulp.parallel('jade'));
      gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
      gulp.watch('./src/js/**/*.js', gulp.parallel('babel'));

      done();
    },
  ));

gulp.task('build',
  gulp.series(
    'clean',
    bower,
    vendorJs,
    gulp.parallel(
      'jade',
      'sass',
      'babel',
      'imageMin',
    ),
  ));
