const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return (
    gulp
      .src([
        'gulpfile.js',
        // More js files here.
      ])
      // eslint() attaches the lint output to the 'eslint' property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach().
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError())
  );
});
