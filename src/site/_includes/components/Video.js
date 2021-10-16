const {Video: BuildVideoShortcode} = require('webdev-infra/shortcodes/Video');

const {bucket, imgixDomain} = require('../../_data/site');

/**
 * @param {import('webdev-infra/types').VideoArgs} args Named arguments
 * @returns {string}
 */
const Video = BuildVideoShortcode(bucket, imgixDomain);

module.exports = {Video};
