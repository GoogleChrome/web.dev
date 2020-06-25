/**
 * @fileoverview Helper for hashing content.
 */

const crypto = require('crypto');

const hashLength = 8;

/**
 * Hashes the passed content.
 *
 * @param {string} files to hash
 * @return {string}
 */
function hashForContent(contents) {
  const c = crypto.createHash('sha1');
  c.update(contents);

  const hash = c.digest('hex').substr(0, hashLength);
  if (hash.length !== hashLength) {
    throw new TypeError(`could not hash content`);
  }
  return hash;
}

module.exports = {
  hashForContent,
};
