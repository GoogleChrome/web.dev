const {imgix: imgixFilter} = require('webdev-infra/filters/imgix');
const {Img: BuildImgShortcode} = require('webdev-infra/shortcodes/Img');

const {imgixDomain} = require('../../_data/site');

/**
 * Takes an imgix url or path and generates an `<img>` element with `srcset`.
 *
 * @param {import('webdev-infra/types').ImgArgs} args Named arguments
 * @return {string}
 */
const Img = BuildImgShortcode(imgixDomain);

function MetaImg(args) {
  const IS_SVG_IMG = /\.svg$/i.test(args.src);

  if (!args.params?.auto && !IS_SVG_IMG) {
    args.params = args.params || {};
    args.params.auto = 'format';
  }

  const image = Img(args);

  if (args.darkSrc) {
    const darkArgs = { ...args, src: args.darkSrc };
    const darkImage = Img(darkArgs);

    return `
      <picture>
        <source srcset="${darkImage}" media="(prefers-color-scheme: dark)">
        ${image}
      </picture>
    `;
  }

  return image;
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
