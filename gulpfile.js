const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const sasslint = require('gulp-sass-lint');
const rename = require('gulp-rename');

const assetTypes = `jpg,jpeg,png,svg,webp,webm,mp4,mov,ogg,wav,mp3`;

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

// These are images that go with our landing pages. They live in the same
// directory as our other eleventy content, but they shouldn't get their
// directories stripped like we do for the `posts` directory.
gulp.task('copy-landing-page-assets', () => {
  return gulp
    .src(['./src/site/content/en/images/**/*'])
    .pipe(gulp.dest('./dist/en/images'));
});

// These are required yaml files, robots.txt, sitemap.xml, etc.
gulp.task('copy-configuration-assets', () => {
  return gulp
    .src(['./src/site/content/**/*.{yaml,txt,xml}'])
    .pipe(gulp.dest('./dist'));
});

// These are images that live with our pattern library.
gulp.task('copy-sandbox-assets', () => {
  return gulp
    .src([`./src/site/content/sandbox/**/*.{${assetTypes}}`])
    .pipe(gulp.dest('./dist/sandbox'));
});

// Because eleventy's passthroughFileCopy does not work with permalinks
// we need to manually copy over content images ourselves.
// Note that we only copy over the images in the en/ directory.
// On the server we'll redirect localized docs to request images from en/.
gulp.task('copy-post-assets', () => {
  return (
    gulp
      .src([
        `./src/site/content/en/**/*.{${assetTypes}}`,
        '!./src/site/content/en/images/**/*', // leave the images dir alone
      ])
      // Removes the `posts` directory from the image output path.
      // This makes the images show up in the same spot as the permalinked posts
      // they belong to.
      .pipe(
        rename(function(assetPath) {
          assetPath.dirname = path.basename(assetPath.dirname);
        })
      )
      .pipe(gulp.dest('./dist/en'))
  );
});

gulp.task(
  'build',
  gulp.series(
    'scss',
    'copy-global-assets',
    'copy-landing-page-assets',
    'copy-configuration-assets',
    'copy-sandbox-assets',
    'copy-post-assets'
  )
);

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.scss', gulp.series('scss'));
  gulp.watch('./src/images/**/*', gulp.series('copy-global-assets'));
  gulp.watch(
    './src/site/content/en/images/**/*',
    gulp.series('copy-landing-page-assets')
  );
  gulp.watch(
    './src/site/content/**/*.{yaml,txt}',
    gulp.series('copy-configuration-assets')
  );
  gulp.watch(
    `./src/site/content/sandbox/**/*.{${assetTypes}}`,
    gulp.series('copy-sandbox-assets')
  );
  gulp.watch(
    `./src/site/content/en/**/*.{${assetTypes}}`,
    gulp.series('copy-post-assets')
  );
});
