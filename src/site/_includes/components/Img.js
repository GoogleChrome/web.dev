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
 * Generates src URL of image from imgix path or URL.
 *
 * @param {string} src Path (or URL) for image.
 * @param {Object} params Imgix API params.
 * @return {string}
 */
const generateSrc = (src, params = {}) =>
  client.buildURL(src, {...DEFAULT_PARAMS, ...params});

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
    srcset="${srcset}"
    sizes="${sizes}"
    height="${heightAsNumber}"
    width="${widthAsNumber}"
    ${alt ? `alt="${safeHtml`${alt}`}"` : ''}
    ${className ? `class="${className}"` : ''}
    ${lazy ? 'loading="lazy"' : ''}
  />`.replace(/\n/g, '');

  if (linkTo) {
    imgTag = html`<a href="${fullSrc}">${imgTag}</a>`;
  }

  return imgTag;
};

module.exports = {Img, generateSrc};
