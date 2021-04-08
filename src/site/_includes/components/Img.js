const {html, safeHtml} = require('common-tags');
const ImgixClient = require('imgix-core-js');
const {imgix: domain} = require('../../_data/site');

const client = new ImgixClient({domain, includeLibraryParam: false});
const MIN_WIDTH = 200;
const MAX_WIDTH = 800;
// The highest device pixel ratio we'll generate srcsets for.
const MAX_DPR = 2; // @2x
const DEFAULT_PARAMS = {auto: 'format'};
/**
 * @param {string} src
 * @returns {boolean}
 */
const IS_UPLOADED_IMG = (src) => {
  /**
   * Because file extensions may be upper case, we split the string based on
   * a `.`, which we expect to signify the files extension. We then check if
   * new array has a length less than 2. If it does then there was no `.` and
   * therefore there was no extension. Then we lower case the last element
   * of the array (what we believe to be the extension). We merge the array
   * back into a string and test that string.
   */
  const splitSrc = src.split('.');
  if (splitSrc.length < 2) {
    return false;
  }
  splitSrc.push(splitSrc.pop().toLowerCase());
  src = splitSrc.join('.');

  return /^image\/[A-Za-z0-9]*\/[A-Za-z0-9]*\.(gif|jpe?g|tiff?|png|webp|bmp|svg|ico)$/.test(
    src,
  );
};

/**
 * @param {string} src
 * @param {Object} [params]
 * @returns {boolean}
 */
const isSimpleImg = (src, params = {}) => /\.svg$/.test(src) && !params.fm;

/**
 * Generates src URL of image from imgix path or URL.
 *
 * @param {string} src Path (or URL) for image.
 * @param {Object} [params] Imgix API params.
 * @return {string}
 */
const generateSrc = (src, params = {}) => {
  params = {...DEFAULT_PARAMS, ...params};

  // Check if image is an SVG, if it is we don't need or want to process it
  // If we do imgix will rasterize the image.
  const doNotUseParams = isSimpleImg(src, params);

  return client.buildURL(src, doNotUseParams ? {} : params);
};

/**
 * Takes an imgix url or path and generates an `<img>` element with `srcset`.
 *
 * @param {ImgArgs} args Named arguments
 * @return {string}
 */
const Img = function (args) {
  const {src, alt, width, height, class: className, linkTo, params} = args;
  let {lazy, options, sizes} = args;

  const checkHereIfError = `ERROR IN ${
    // @ts-ignore: `this` has type of `any`
    this.page ? this.page.inputPath : 'UNKNOWN'
  }, IMG ${src}`;

  if (src === undefined || typeof src !== 'string') {
    throw new Error(`${checkHereIfError}: src is a required argument`);
  }

  if (!IS_UPLOADED_IMG(src)) {
    throw new Error(
      `${checkHereIfError}: invalid src provided (was this added via the uploader?)`,
    );
  }

  if (alt === undefined || typeof alt !== 'string') {
    throw new Error(
      `${checkHereIfError}: alt text must be a string, received a ${typeof alt}`,
    );
  }

  if (height === undefined || isNaN(Number(height))) {
    throw new Error(`${checkHereIfError}: height must be a number`);
  }
  const heightAsNumber = parseInt(height, 10);

  if (width === undefined || isNaN(Number(width))) {
    throw new Error(`${checkHereIfError}: width must be a number`);
  }
  const widthAsNumber = parseInt(width, 10);

  if (lazy === undefined) {
    lazy = true;
  }

  const doNotUseSrcset = isSimpleImg(src, params);

  // https://github.com/imgix/imgix-core-js#imgixclientbuildsrcsetpath-params-options
  options = {
    // Use the image width as the lower bound.
    // Note this may be smaller than MIN_WIDTH.
    minWidth: Math.min(MIN_WIDTH, widthAsNumber),
    // Use image width * dpr as the upper bound, maxed out at 1,600px.
    maxWidth: Math.min(MAX_WIDTH * MAX_DPR, widthAsNumber * MAX_DPR),
    widthTolerance: 0.07,
    ...options,
  };
  // https://docs.imgix.com/apis/rendering
  const fullSrc = generateSrc(src, params);
  const srcset = client.buildSrcSet(src, params, options);
  if (sizes === undefined) {
    if (widthAsNumber >= MAX_WIDTH) {
      sizes = `(min-width: ${MAX_WIDTH}px) ${MAX_WIDTH}px, calc(100vw - 48px)`;
    } else {
      sizes = `(min-width: ${widthAsNumber}px) ${widthAsNumber}px, calc(100vw - 48px)`;
    }
  }

  // Below you'll notice that we do alt !== undefined. That's because passing in
  // an empty string is a valid alt value. It tells a screen reader to ignore
  // the image (useful for purely decorative images). If we just did alt ? ...
  // the emptry string would evaluate as falsey and no alt attribute would be
  // written at all—which _is_ an accessibility violation.
  /* eslint-disable lit-a11y/alt-text */
  let imgTag = html` <img
    src="${fullSrc}"
    height="${heightAsNumber}"
    width="${widthAsNumber}"
    ${doNotUseSrcset ? '' : `srcset="${srcset}"`}
    ${doNotUseSrcset ? '' : `sizes="${sizes}"`}
    ${alt ? `alt="${safeHtml`${alt}`}"` : ''}
    ${className ? `class="${className}"` : ''}
    ${lazy ? 'loading="lazy"' : ''}
  />`;
  /* eslint-enable lit-a11y/alt-text */

  if (linkTo) {
    imgTag = html`<a href="${fullSrc}">${imgTag}</a>`;
  }

  return imgTag.replace(/\n/g, '');
};

module.exports = {Img, generateSrc};
