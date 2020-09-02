const {dest, src} = require('gulp');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const through2 = require('through2');
const rename = require('gulp-rename');

const isProduction = process.env.ELEVENTY_ENV === 'prod';

/* eslint-disable max-len */
const assetTypes =
  'jpg,jpeg,png,svg,gif,webp,webm,mp4,mov,ogg,wav,mp3,txt,yaml';
/* eslint-enable max-len */

const compressImagesTransform = (pngQuality, jpegQuality) => {
  if (!isProduction) {
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
const siteAssets = () => {
  return src(['./src/images/**/*'])
    .pipe(compressImagesTransform(1.0, 0.8))
    .pipe(dest('./dist/images'));
};

// Images and any other assets in the content directory that should be copied
// over along with the posts themselves.
// Because we use permalinks to strip the parent directories from our posts
// we need to also strip them from the content paths.
const contentAssets = () => {
  return (
    src([`./src/site/content/**/*.{${assetTypes}}`])
      .pipe(compressImagesTransform(0.8, 0.8))
      // This makes the images show up in the same spot as the permalinked posts
      // they belong to.
      .pipe(
        rename((assetPath) => {
          const parts = assetPath.dirname.split('/');
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
          assetPath.dirname = parts.join('/');
        }),
      )
      .pipe(dest('./dist/'))
  );
};

module.exports = {siteAssets, contentAssets};
