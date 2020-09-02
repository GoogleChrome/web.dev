const {dest, src} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sassProcessor = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const {hashForContent} = require('../build/hash');
const fs = require('fs');

// We want to be using canonical Sass, rather than node-sass
sassProcessor.compiler = require('sass');

// Flags whether we compress the output, generate sourcemaps, etc
const isProduction = process.env.ELEVENTY_ENV === 'prod';

/**
 *
 * @param {Buffer} vinly.contents
 * @param {string} vinly.basename
 */
const hashOutput = ({contents, basename}) => {
  // gulp.dest() requires that we return a path to an output directory.
  // We'll return './dist', but we will also perform a side-effect and output
  // a hash of the file to src/site/_data/resourceCSS.json which will be used
  // by workbox for its precache manifest and layout.njk to invalidate the file.
  const response = './dist';

  const hash = hashForContent(contents);
  const resourceName = `${basename}?v=${hash}`;
  fs.writeFileSync(
    'src/site/_data/resourceCSS.json',
    JSON.stringify({path: `/${resourceName}`}),
  );

  return response;
};

const sass = () => {
  return src('./src/styles/**/*.scss', {sourcemaps: !isProduction})
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(gulpif(isProduction, autoprefixer()))
    .pipe(gulpif(isProduction, cleanCSS({level: 2})))
    .pipe(dest(hashOutput, {sourcemaps: !isProduction}));
};

module.exports = sass;
