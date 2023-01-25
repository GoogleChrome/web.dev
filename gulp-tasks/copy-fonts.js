const gulp = require('gulp');

/**
 * @returns {NodeJS.ReadWriteStream}
 */
const copyFonts = () => {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts/'));
};

module.exports = copyFonts;
