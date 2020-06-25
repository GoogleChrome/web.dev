const crypto = require('crypto');
const fs = require('fs');

const hashLength = 8;

/**
 * Hashes the passed path. If the file doesn't exist, return a random hash. If
 * we're in prod, then crash.
 *
 * @param {string} files to hash
 * @return {string}
 */
function hashFor(...files) {
  if (!files.length) {
    throw new Error(`must hash at least one file`);
  }

  const c = crypto.createHash('sha1');
  for (const f of files) {
    const contents = fs.readFileSync(f);
    c.update(contents);
  }

  const hash = c.digest('hex').substr(0, hashLength);
  if (hash.length !== hashLength) {
    throw new TypeError(`could not hash: ${files.join(',')}`);
  }
  return hash;
}

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
  hashFor,
  hashForContent,
};
