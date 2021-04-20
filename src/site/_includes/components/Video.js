const {Video: VideoShortcode} = require('webdev-infra/shortcodes/Video');

const {bucket, imgixDomain} = require('../../_data/site');

/**
 * @param {wd.VideoArgs} args Named arguments
 * @returns {string}
 */
const Video = VideoShortcode(bucket, imgixDomain);

module.exports = {Video};
