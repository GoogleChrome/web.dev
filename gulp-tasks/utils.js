const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imagemin = require('gulp-imagemin');
const through2 = require('through2');

const isProd = process.env.ELEVENTY_ENV === 'prod';
const isStaging = process.env.ELEVENTY_ENV === 'staging';

const compressImagesTransform = (pngQuality, jpegQuality) => {
  if (!isProd && !isStaging) {
    // This is the identity transform, which does nothing and just passes
    // the images through directly.
    return through2.obj();
  }
  return imagemin([
    // @ts-ignore
    pngquant({quality: [pngQuality, pngQuality]}),
    mozjpeg({quality: jpegQuality * 100}),
  ]);
};

module.exports = {compressImagesTransform};
