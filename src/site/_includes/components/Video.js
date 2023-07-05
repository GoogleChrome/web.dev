const {Video: BuildVideoShortcode} = require('webdev-infra/shortcodes/Video');

const {bucket, imgixDomain} = require('../../_data/site');

const Video = BuildVideoShortcode(bucket, imgixDomain);

/**
 * @param {import('webdev-infra/types').VideoArgs} args Named arguments
 * @returns {string}
 */
function VideoAlt (args) {
  let html = Video.call(this, args);
  if (this.ctx.export) {
    // Replace double spaces in html with single spaces, as otherwise
    // it looks weird in generated markdown
    html = html.replace(/\s\s+/g, ' ');
  }

  return html;
}

module.exports = {Video: VideoAlt};
