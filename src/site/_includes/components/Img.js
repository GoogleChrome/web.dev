const fse = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const {imgix: imgixFilter} = require('webdev-infra/filters/imgix');
const {Img: BuildImgShortcode} = require('webdev-infra/shortcodes/Img');

const {imgixDomain} = require('../../_data/site');
const {exportFile} = require('../../_utils/export-file');

const TMP_IMG_PATH = path.join(__dirname, '../../../..', '.tmp', 'img');

/**
 * Takes an imgix url or path and generates an `<img>` element with `srcset`.
 *
 * @param {import('webdev-infra/types').ImgArgs} args Named arguments
 * @return {string}
 */
const Img = BuildImgShortcode(imgixDomain);

async function MetaImg(args) {
  const IS_SVG_IMG = /\.svg$/i.test(args.src);

  if (!args.params?.auto && !IS_SVG_IMG) {
    args.params = args.params || {};
    args.params.auto = 'format';
  }

  if (this.ctx?.export) {
    let image = null;
    // For export we want to download the image, but only do so
    // if it is not yet cached.
    if (!fse.existsSync(path.join(TMP_IMG_PATH, args.src))) {
      image = await fetch(generateImgixSrc(args.src, args.params));
      image = await image.buffer();
      console.log('Downloading', args.src);
      await fse.outputFile(path.join(TMP_IMG_PATH, args.src), image);
    }

    if (!image) {
      console.log('Reading', args.src, 'from cache');
      image = await fse.readFile(path.join(TMP_IMG_PATH, args.src));
    }

    // And after it's cached we just copy it to the export directory.
    await exportFile(this.ctx, image, args.src);
    // Instead of markdown img syntax we use HTML img syntax, to make sure
    // that the image is rendered in <figures> and tables - height is omitted
    // as the CMS does it's own thing with it.
    return `<img src="${args.src}" alt="${args.alt}" width="${args.width}" height="${args.height}">`;
  }

  return Img(args);
}

/**
 * Generates src URL of image from imgix path or URL.
 *
 * @param {string} src Path (or URL) for image.
 * @param {import('webdev-infra/types').TODOObject} [params] Imgix API params.
 * @return {string}
 */
const generateImgixSrc = imgixFilter(imgixDomain);

module.exports = {Img: MetaImg, generateImgixSrc};
