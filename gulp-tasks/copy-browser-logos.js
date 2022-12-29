const gulp = require('gulp');

/**
 * Copies the browser logos fetched from npm to the icons directory.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
const copyBrowserLogos = () =>
  gulp
    .src([
      './node_modules/@browser-logos/chrome/chrome.svg',
      './node_modules/@browser-logos/edge/edge.svg',
      './node_modules/@browser-logos/firefox/firefox.svg',
      './node_modules/@browser-logos/safari/safari.svg',
    ])
    .pipe(gulp.dest('./src/images/icons/'));

module.exports = copyBrowserLogos;
