/**
 * @fileoverview Helper that reads and checks the resource path
 */

const fs = require('fs');
const path = require('path');

/**
 * Finds the resource path for the given name, and confirms that the file exists (throwing an
 * Error otherwise). Returns the path including any query parameters, but without any leading "/",
 * for use in caching.
 *
 * @param {string} name
 * @return {string}
 */
function resourcePath(name) {
  name = name.toUpperCase();

  const f = path.join(
    __dirname,
    '../../src/site/_data',
    `resource${name}.json`,
  );

  const raw = JSON.parse(fs.readFileSync(f), 'utf-8');

  const {path: rawPath} = raw;
  if (rawPath === undefined) {
    throw new Error(`could not find 'path' key in: ${f}`);
  }

  const cleanPath = rawPath.split('?')[0]; // remove trailing query params
  const check = path.join(__dirname, '../../dist', cleanPath);
  if (!fs.existsSync(check)) {
    throw new Error(`path did not exist: ${check}`);
  }

  return rawPath[0] === '/' ? rawPath.substr(1) : rawPath;
}

module.exports = resourcePath;
