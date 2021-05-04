const gulp = require('gulp');

/**
 * These are global images used in CSS and base HTML, such as author profiles.
 * We don't compress the PNGs here as they are trivially small (site icons).
 *
 * @returns {NodeJS.ReadWriteStream}
 */
const copyGlobalImages = () =>
  gulp.src(['./src/images/**/*']).pipe(gulp.dest('./dist/images'));

module.exports = copyGlobalImages;
