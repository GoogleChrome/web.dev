const path = require('path');

const {imgix: imgixFilter} = require('webdev-infra/filters/imgix');
const {Img: BuildImgShortcode} = require('webdev-infra/shortcodes/Img');

const {imgixDomain} = require('../../_data/site');
const {exportFile} = require('../../_utils/export-file');
const {getImage} = require('../../_utils/get-file');

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
    const image = await getImage(generateImgixSrc(args.src, args.params));

    // And after it's cached we just copy it to the export directory.
    const parsedPath = path.parse(this.ctx.page.url);
    await exportFile(
      this.ctx,
      image,
      path.join(this.ctx.exportPath, parsedPath.name, args.src),
    );
    // Instead of markdown img syntax we use HTML img syntax, to make sure
    // that the image is rendered in <figures> and tables
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
