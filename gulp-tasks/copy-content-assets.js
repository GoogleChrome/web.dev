const gulp = require('gulp');
const rename = require('gulp-rename');
const {compressImagesTransform} = require('./utils');
const {defaultLocale} = require('../src/site/_data/site');

const assetTypes =
  'jpg,jpeg,png,svg,gif,webp,webm,mp4,mov,ogg,wav,mp3,txt,yaml';

/**
 * Images and any other assets in the content directory that should be copied
 * over along with the posts themselves.
 * Because we use permalinks to strip the parent directories from our posts
 * we need to also strip them from the content paths.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
const copyContentAssets = () => {
  return (
    gulp
      .src([`./src/site/content/**/*.{${assetTypes}}`])
      .pipe(compressImagesTransform(0.8, 0.8))
      // This makes the images show up in the same spot as the permalinked posts
      // they belong to.
      .pipe(
        rename((assetPath) => {
          const defaultLocaleRegExp = new RegExp(`^${defaultLocale}/`);
          const parts = assetPath.dirname.split('/');
          assetPath.dirname = assetPath.dirname.replace(
            defaultLocaleRegExp,
            '',
          );
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
          // can live at /some-post/foo.jpg since that's what we'll actually
          // serve in production.
          // e.g. en/blog/foo/bar.jpg -> /foo/bar.jpg
          parts.splice(1, 1);
          assetPath.dirname = parts.join('/').replace(defaultLocaleRegExp, '');
        }),
      )
      .pipe(gulp.dest('./dist/'))
  );
};

module.exports = copyContentAssets;
