const {env} = require('../_data/site');

/**
 * Filter draft learning paths out.
 * @param {object} path An eleventy path object.
 * @return {boolean} Whether or not the path should go live.
 */
module.exports = function livePaths(path) {
  // If we're in dev mode, force draft learning paths to show up.
  if (env === 'dev') {
    return true;
  }

  return !path.draft;
};
