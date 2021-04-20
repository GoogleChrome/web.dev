const {imgix: imgixFilter} = require('webdev-infra/filters/imgix');
const {Img: ImgShortcode} = require('webdev-infra/shortcodes/Img');

const {imgixDomain} = require('../../_data/site');

/**
 * Takes an imgix url or path and generates an `<img>` element with `srcset`.
 *
 * @param {wd.ImgArgs} args Named arguments
 * @return {string}
 */
const Img = ImgShortcode(imgixDomain);

/**
 * Generates src URL of image from imgix path or URL.
 *
 * @param {string} src Path (or URL) for image.
 * @param {wd.TODOObject} [params] Imgix API params.
 * @return {string}
 */
const imgix = imgixFilter(imgixDomain);

module.exports = {Img, imgix};
