const {dest, src} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sassProcessor = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');

// We want to be using canonical Sass, rather than node-sass
sassProcessor.compiler = require('sass');

// Flags whether we compress the output, generate sourcemaps, etc
const isProduction = process.env.ELEVENTY_ENV === 'prod';

const sass = () => {
  return src('./src/styles/**/*.scss', {sourcemaps: !isProduction})
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(gulpif(isProduction, autoprefixer()))
    .pipe(gulpif(isProduction, cleanCSS({level: 2})))
    .pipe(dest('./dist', {sourcemaps: !isProduction}));
};

module.exports = sass;
