const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const path = require('path');

const SCSS_DIR = './styles/';
const CSS_OUTPUT_DIR = './css';

/**
 * A task to generate the css dir with sass/css source files.
 */
gulp.task('css', () => {
  return gulp.src([
    path.join(SCSS_DIR, 'app.scss'),
    path.join(SCSS_DIR, '**/*.css'),
  ])
    .pipe(sass({
      outputStyle: 'compressed',
    }).on('error', sass.logError))
    .pipe(gulp.dest(CSS_OUTPUT_DIR));
});

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

/**
 * A task to watch for changes and rebuild if needed.
 */
gulp.task('watch', () => {
  gulp.watch(path.join(SCSS_DIR, '**/*.scss'), gulp.parallel('css'));
});

/**
 * Build generated files.
 */
gulp.task('build', gulp.parallel(
  'css',
  // More build tasks here.
));

/**
 * Build and watch things during development.
*/
gulp.task('dev', gulp.series(
  'build',
  'watch'
));
