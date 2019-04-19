const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const sasslint = require('gulp-sass-lint');

/* eslint-disable max-len */
const assetTypes = `jpg,jpeg,png,svg,gif,webp,webm,mp4,mov,ogg,wav,mp3,txt,yaml`;
/* eslint-enable max-len */

gulp.task('lint-js', () => {
  return (
    gulp
      .src(['.eleventy.js', './src/**/*.js'])
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

gulp.task('lint-scss', () => {
  return gulp
    .src('src/styles/**/*.scss')
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('scss', () => {
  return (
    gulp
      .src('./src/styles/all.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      // Sourcemaps directory is relative to the output directory.
      // If output dir is './dist' this will place them in './dist/maps'.
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./dist'))
  );
});

// These are images that our CSS refers to and must be checked in to DevSite.
gulp.task('copy-global-assets', () => {
  return gulp.src(['./src/images/**/*']).pipe(gulp.dest('./dist/images'));
});

// Images and any other assets in the content directory that should be copied
// over along with the posts themselves.
// Note the blog directory is excluded because it uses permalinks to change its
// output paths. We'll handle the blog in a separate gulp task.
gulp.task('copy-content-assets', () => {
  return gulp
    .src([
      `./src/site/content/**/*.{${assetTypes}}`,
      `!./src/site/content/blog/**/*`,
    ])
    .pipe(gulp.dest('./dist/'));
});

// Because eleventy's passthroughFileCopy does not work with permalinks
// we need to manually copy over blog images ourselves.
// Note that we only copy over the images in the en/ directory.
// On the server we'll redirect localized docs to request images from en/.
gulp.task('copy-blog-assets', () => {
  return gulp
    .src([`./src/site/content/en/blog/**/*.{${assetTypes}}`])
    .pipe(gulp.dest('./dist/en'));
});

gulp.task(
  'build',
  gulp.parallel(
    'scss',
    'copy-global-assets',
    'copy-content-assets',
    'copy-blog-assets',
  )
);

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.scss', gulp.series('scss'));
  gulp.watch('./src/images/**/*', gulp.series('copy-global-assets'));
  gulp.watch(
    './src/site/content/**/*',
    gulp.series('copy-content-assets')
  );
  gulp.watch(
    `./src/site/content/en/blog/**/*.{${assetTypes}}`,
    gulp.series('copy-blog-assets')
  );
});
