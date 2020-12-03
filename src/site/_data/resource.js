/**
 * @fileoverview Generates the resources version, based on the layout itself plus CSS/JS.
 *
 * The site is a SPA: it loads the HTML of further pages but modifies the current document to
 * include just the updated content. This has speed/perf benefits especially around our logged-in
 * experience and any ongoing JS.
 *
 * When the site first boots up and the initial HTML arrives, we record this resources version. If
 * the version of a _further_ page, loaded with this SPA logic, doesn't match this one: we throw out
 * and just load the site anew. This occurs when we make any JS or CSS change to the site, so as to
 * ensure users get the updated version.
 */

const {generateAndValidateHash} = require('../../build/hash');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const isProd = process.env.ELEVENTY_ENV === 'prod';

const files = [
  'resourceCSS.json',
  'resourceJS.json',
  '../_includes/layout.njk',
];
const filePaths = files.map((f) => path.join(__dirname, f));

module.exports = () => {
  let version = '';
  let mtime = 0;
  const c = crypto.createHash('sha1');

  try {
    for (const file of filePaths) {
      const stat = fs.statSync(file);
      mtime = Math.max(stat.mtimeMs, mtime);
      const bytes = fs.readFileSync(file);
      c.update(bytes);
    }
  } catch (e) {
    // Don't explode in dev if the resource doesn't exist yet.
    if (isProd || e.code !== 'ENOENT') {
      throw e;
    }
    console.warn('failed to generate resourceVersion', e);
  }

  // also include the greatest mtime, just in case: this also lets us do lexical comparison
  version = `${mtime.toString(16)}::${generateAndValidateHash(c)}`;
  return {version};
};
