const gulp = require('gulp');

/**
 * These are misc top-level assets.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
const copyMisc = () => {
  return gulp.src(['./src/misc/**/*']).pipe(gulp.dest('./dist'));
};

module.exports = copyMisc;
