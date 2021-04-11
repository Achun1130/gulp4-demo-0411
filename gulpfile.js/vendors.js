const gulp = require('gulp');
const mainBowerFiles = require('main-bower-files');
const $ = require('gulp-load-plugins')();

const { opts } = require('./opts');

const bower = () => (
  gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.tmp'))
);

const vendorJs = () => (
  gulp.src([
    './.tmp/**/*.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
  ])
    .pipe($.concat('vendors.js'))
    .pipe($.if(opts.env === 'production', $.uglify()))
    .pipe(gulp.dest('./dist/js'))
);

exports.bower = bower;
exports.vendorJs = vendorJs;
