const {Video: BuildVideoShortcode} = require('webdev-infra/shortcodes/Video');

const {bucket, imgixDomain} = require('../../_data/site');

/**
 * @param {wd.VideoArgs} args Named arguments
 * @returns {string}
 */
const Video = BuildVideoShortcode(bucket, imgixDomain);

module.exports = {Video};
