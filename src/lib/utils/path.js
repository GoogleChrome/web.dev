/**
 * Replaces backslashes with forward. Useful when, for example,
 * using paths with fast-glob (which requires forward slashes)
 * on Windows.
 *
 * @param {string} path
 * @returns {*}
 */
function forceForwardSlash(path) {
  return path.replace(/\\/g, '/');
}

module.exports = {
  forceForwardSlash,
};
