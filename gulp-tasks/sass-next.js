const {dest, src} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sassProcessor = require('gulp-sass')(require('sass'));

const sourceFile = './src/scss/next.scss';

// Flags wether we compress the output etc
const isProduction = process.env.NODE_ENV === 'production';

const sassNext = (cb) => {
  return src(sourceFile)
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(cleanCSS(isProduction ? {level: 2} : {}))
    .pipe(dest('./dist/css', {sourceMaps: !isProduction}))
    .on('done', cb);
};

module.exports = sassNext;
