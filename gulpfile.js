/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const removeCode = require('gulp-remove-code');

/* eslint-disable max-len */
const assetTypes = `jpg,jpeg,png,svg,gif,webp,webm,mp4,mov,ogg,wav,mp3,txt,yaml`;
/* eslint-enable max-len */

const isProd = process.env.ELEVENTY_ENV === 'prod';

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

gulp.task('copy-scss', () => {
  return gulp
    .src('./src/styles/**/*.scss')
    .pipe(removeCode({production: true, commentStart: '//'}))
    .pipe(gulp.dest('./dist/styles'));
});

// These are images that our CSS refers to and must be checked in to DevSite.
gulp.task('copy-global-assets', () => {
  return gulp.src(['./src/images/**/*']).pipe(gulp.dest('./dist/images'));
});

// Images and any other assets in the content directory that should be copied
// over along with the posts themselves.
// Because we use permalinks to strip the parent directories form our posts
// we need to also strip them from the content paths.
gulp.task('copy-content-assets', () => {
  return gulp
    .src([
      `./src/site/content/en/**/*.{${assetTypes}}`,
    ])
    .pipe(gulpif(isProd, imagemin([
      pngquant({quality: [0.8, 0.8]}),
      mozjpeg({quality: 80}),
    ])))
    // This makes the images show up in the same spot as the permalinked posts
    // they belong to.
    .pipe(
      rename(function(assetPath) {
        const parts = assetPath.dirname.split('/');
        // Let the en/images directory pass through.
        if (parts[0] === 'images') {
          return;
        }
        // Let en/handbook images pass through.
        if (parts[0] === 'handbook') {
          return;
        }
        return assetPath.dirname = path.basename(assetPath.dirname);
      })
    )
    .pipe(gulp.dest('./dist/en'));
});

// Because eleventy's passthroughFileCopy does not work with permalinks
// we need to manually copy over blog images ourselves.
// Note that we only copy over the images in the en/ directory.
// On the server we'll redirect localized docs to request images from en/.
// gulp.task('copy-blog-assets', () => {
//   return gulp
//     .src([`./src/site/content/en/blog/**/*.{${assetTypes}}`])
//     .pipe(gulp.dest('./dist/en'));
// });

let buildTask;
if (isProd) {
  buildTask = gulp.parallel(
    'copy-scss',
    'copy-content-assets',
  );
} else {
  buildTask = gulp.parallel(
    'scss',
    'copy-global-assets',
    'copy-content-assets',
  );
}
gulp.task('build', buildTask);

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.scss', gulp.series('scss'));
  gulp.watch('./src/images/**/*', gulp.series('copy-global-assets'));
  gulp.watch(
    './src/site/content/**/*',
    gulp.series('copy-content-assets')
  );
  // gulp.watch(
  //   `./src/site/content/en/blog/**/*.{${assetTypes}}`,
  //   gulp.series('copy-blog-assets')
  // );
});
