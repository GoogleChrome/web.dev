const mime = require('browser-media-mime-type');
const {html} = require('common-tags');
const path = require('path');
const url = require('url');
const {bucket, gcs} = require('../../_data/site');

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
const Video = (args) => {
  if (typeof args.src === 'string') {
    args.src = [args.src];
  }

  const {
    autoplay,
    autoPictureInPicture,
    className,
    disablePictureInPicture,
    height,
    loop,
    muted,
    poster,
    preload,
    src,
    width,
  } = args;

  return html`<video
    ${autoplay ? 'autoplay' : ''}
    ${autoPictureInPicture ? 'autoPictureInPicture' : ''}
    ${className ? `class="${className}"` : ''}
    controls
    ${disablePictureInPicture ? 'disablePictureInPicture' : ''}
    ${height ? `height="${height}"` : ''}
    ${loop ? 'loop' : ''}
    ${muted ? 'muted' : ''}
    ${poster ? `poster="${poster}"` : ''}
    ${preload ? `preload="${preload}"` : ''}
    ${width ? `width="${width}"` : ''}
  >
    ${src.map(generateSource)}
  </video>`.replace(/\n/g, '');
};

module.exports = {Video};
