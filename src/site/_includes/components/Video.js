const mime = require('browser-media-mime-type');
const {html} = require('common-tags');
const path = require('path');
const url = require('url');
const {bucket, gcs} = require('../../_data/site');
const {generateSrc} = require('./Img');

/**
 *
 * @param {string} src
 * @return {string}
 */
const generateSource = (src) => {
  const extname = path.extname(src);
  const type = mime(extname);
  src = new url.URL(path.join(bucket, src), gcs).href;
  return html`
    <source src="${src}" ${type ? `type="${type}"` : ''} />
  `.replace(/\n/g, '');
};

/**
 * @param {VideoArgs} args Named arguments
 * @returns {string}
 */
const Video = function (args) {
  const checkHereIfError = `ERROR IN ${
    // @ts-ignore: `this` has type of `any`
    this.page ? this.page.inputPath : 'UNKNOWN'
  }`;

  if (typeof args.src === 'string') {
    args.src = [args.src];
  }

  if (args.src.length === 0) {
    throw new Error(`${checkHereIfError}: no src provided`);
  }

  const {
    autoplay,
    autoPictureInPicture,
    class: className,
    controls,
    disablePictureInPicture,
    height,
    id,
    loop,
    linkTo,
    muted,
    poster,
    preload,
    src,
    width,
  } = args;

  let videoTag = html`<video
    ${autoplay ? 'autoplay playsinline' : ''}
    ${autoPictureInPicture ? 'autoPictureInPicture' : ''}
    ${className ? `class="${className}"` : ''}
    ${controls ? 'controls' : ''}
    ${disablePictureInPicture ? 'disablePictureInPicture' : ''}
    ${height ? `height="${height}"` : ''}
    ${id ? `id="${id}"` : ''}
    ${loop ? 'loop' : ''}
    ${muted ? 'muted' : ''}
    ${poster ? `poster="${generateSrc(poster)}"` : ''}
    ${preload ? `preload="${preload}"` : ''}
    ${width ? `width="${width}"` : ''}
  >
    ${src.map(generateSource)}
  </video>`;

  if (linkTo) {
    videoTag = html`<a
      href="${new url.URL(path.join(bucket, src[0]), gcs).href}"
      >${videoTag}</a
    >`;
  }

  return videoTag.replace(/\n/g, '');
};

module.exports = {Video};
