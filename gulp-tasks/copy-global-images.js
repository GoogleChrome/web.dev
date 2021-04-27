const gulp = require('gulp');
const {compressImagesTransform} = require('./utils');

/**
 * These are global images used in CSS and base HTML, such as author profiles.
 * We don't compress the PNGs here as they are trivially small (site icons).
 *
 * @returns {NodeJS.ReadWriteStream}
 */
const copyGlobalImages = () => {
  return gulp
    .src(['./src/images/**/*'])
    .pipe(compressImagesTransform(1.0, 0.8))
    .pipe(gulp.dest('./dist/images'));
};

module.exports = copyGlobalImages;
