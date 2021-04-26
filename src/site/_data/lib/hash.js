/**
 * @fileoverview Helper for hashing content.
 */

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const hashLength = 8;
const isProd = process.env.ELEVENTY_ENV === 'prod';
const isStaging = process.env.ELEVENTY_ENV === 'staging';

function randomHash() {
  return Math.random().toString(16).substring(2);
}

function generateAndValidateHash(c) {
  const hash = c.digest('hex').substr(0, hashLength);
  if (hash.length !== hashLength) {
    throw new TypeError('could not hash content');
  }
  return hash;
}

/**
 * Hashes the passed files. Requires at least one.
 *
 * @param {string} file base file to hash
 * @param {...string} rest additional files to hash
 */
function hashForFiles(file, ...rest) {
  const files = [file].concat(rest);

  const c = crypto.createHash('sha1');

  for (const file of files) {
    const b = fs.readFileSync(file);
    c.update(b);
  }

  return generateAndValidateHash(c);
}

const hashForProdCache = {};

/**
 * Hashes the passed file from within the dist dir if in production mode,
 * returning the file with an appended `?v=<hash>`.
 * In dev mode it will return the file with an appended `?v=<randomHash>` to
 * avoid caching.
 *
 * @param {string} file
 * @return {string}
 */
function hashForProd(file) {
  if (!isProd && !isStaging) {
    return `${file}?v=${randomHash()}`;
  }

  let hash = hashForProdCache[file];
  if (hash === undefined) {
    const distPath = path.join(process.cwd(), 'dist', file);
    try {
      hash = hashForFiles(distPath);
    } catch (err) {
      console.error('Could not find asset at', file);
      return file;
    }

    hashForProdCache[file] = hash;
  }

  return `${file}?v=${hash}`;
}

module.exports = {
  hashForProd,
  randomHash,
};
