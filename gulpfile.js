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

const gulp = require('gulp');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const through2 = require('through2');

/* eslint-disable max-len */
const assetTypes =
  'jpg,jpeg,png,svg,gif,webp,webm,mp4,mov,ogg,wav,mp3,txt,yaml';
/* eslint-enable max-len */

const isProd = process.env.ELEVENTY_ENV === 'prod';

const compressImagesTransform = (pngQuality, jpegQuality) => {
  if (!isProd) {
    // This is the identity transform, which does nothing and just passes
    // the images through directly.
    return through2.obj();
  }
  return imagemin([
    pngquant({quality: [pngQuality, pngQuality]}),
    mozjpeg({quality: jpegQuality * 100}),
  ]);
};

// These are global images used in CSS and base HTML, such as author profiles.
// We don't compress the PNGs here as they are trivially small (site icons).
gulp.task('copy-global-images', () => {
  return gulp
    .src(['./src/images/**/*'])
    .pipe(compressImagesTransform(1.0, 0.8))
    .pipe(gulp.dest('./dist/images'));
});

// These are misc top-level assets.
gulp.task('copy-misc', () => {
  return gulp.src(['./src/misc/**/*']).pipe(gulp.dest('./dist'));
});

// Images and any other assets in the content directory that should be copied
// over along with the posts themselves.
// Because we use permalinks to strip the parent directories from our posts
// we need to also strip them from the content paths.
gulp.task('copy-content-assets', () => {
  return (
    gulp
      .src([`./src/site/content/**/*.{${assetTypes}}`])
      .pipe(compressImagesTransform(0.8, 0.8))
      // This makes the images show up in the same spot as the permalinked posts
      // they belong to.
      .pipe(
        rename((assetPath) => {
          const parts = assetPath.dirname.split('/');
          assetPath.dirname = assetPath.dirname.replace(/^en\//, '');
          // Landing pages should keep their assets.
          // e.g. en/vitals, en/about
          if (parts.length <= 2) {
            return;
          }

          // Let images pass through if they're special, i.e. part of the
          // handbook or newsletter. We don't treat these URLs like the
          // rest of the site and they're allowed to nest.
          const subdir = parts[1];
          const imagePassThroughs = ['handbook', 'newsletter'];
          if (imagePassThroughs.includes(subdir)) {
            return;
          }

          // Some assets are nested under directories which aren't part of
          // their url. For example, we have /en/blog/some-post/foo.jpg.
          // For these assets we need to remove the /blog/ directory so they
          // can live at /en/some-post/foo.jpg since that's what we'll actually
          // serve in production.
          // e.g. en/blog/foo/bar.jpg -> en/foo/bar.jpg
          parts.splice(1, 1);
          assetPath.dirname = parts.join('/').replace(/^en\//, '');
        }),
      )
      .pipe(gulp.dest('./dist/'))
  );
});

gulp.task('copy-node_modules-assets', () => {
  return gulp
    .src(['./node_modules/@webcomponents/webcomponentsjs/bundles/*.js'])
    .pipe(gulp.dest('./dist/lib/webcomponents/bundles/'));
});

gulp.task('copy-fonts', () => {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts/'));
});

gulp.task(
  'build',
  gulp.parallel(
    'copy-global-images',
    'copy-misc',
    'copy-content-assets',
    'copy-node_modules-assets',
    'copy-fonts',
  ),
);

gulp.task('watch', () => {
  gulp.watch('./src/images/**/*', gulp.series('copy-global-images'));
  gulp.watch('./src/misc/**/*', gulp.series('copy-misc'));
  gulp.watch('./src/site/content/**/*', gulp.series('copy-content-assets'));
});
