const {dest, src} = require('gulp');
const sassProcessor = require('gulp-sass')(require('sass'));

const sourceFiles = [
  './src/scss/next.scss',
];

// Flags wether we compress the output etc
const isProduction = process.env.ELEVENTY_ENV === 'prod';

const sass = (cb) => {
  return src(sourceFiles, {sourcemaps: !isProduction})
    .pipe(
      sassProcessor({outputStyle: 'compressed'}).on(
        'error',
        sassProcessor.logError,
      ),
    )
    .pipe(dest('./dist/css', {sourcemaps: !isProduction}))
    .on('done', cb);
};

module.exports = sass;
