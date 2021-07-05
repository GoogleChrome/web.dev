const {dest, src} = require('gulp');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const sassProcessor = require('gulp-sass')(require('sass'));

const designTokens = require('../src/site/_data/design/tokens.js');
const sourceFile = './src/scss/next.scss';

// Flags wether we compress the output etc
const isProduction = process.env.NODE_ENV === 'production';

module.exports = (cb) => {
  return src(sourceFile)
    .pipe(header(designTokens.convertToSass))
    .pipe(sassProcessor().on('error', sassProcessor.logError))
    .pipe(cleanCSS(isProduction ? {level: 2} : {}))
    .pipe(dest('./dist/css', {sourceMaps: !isProduction}))
    .on('done', cb);
};
