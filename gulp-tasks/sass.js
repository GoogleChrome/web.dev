const {dest, src} = require('gulp');
const sass = require('sass');
const sassProcessor = require('gulp-sass')(sass);

const sourceFiles = ['./src/scss/next.scss', './src/styles/main.scss'];

// Flags wether we compress the output etc
const isProduction = process.env.NODE_ENV === 'production';

const sassNext = (cb) => {
  return src(sourceFiles, {sourcemaps: !isProduction})
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(dest('./dist/css', {sourcemaps: !isProduction}))
    .on('done', cb);
};

module.exports = sassNext;
