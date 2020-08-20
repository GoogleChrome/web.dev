/**
 * @fileoverview Generates the site version, based on the layout itself plus CSS/JS.
 *
 * This is used in internal navigation: if we see a change in the version, we throw out the HTML
 * and do a proper fetch.
 */

const {hashForFiles} = require('../../build/hash');
const path = require('path');

const isProd = process.env.ELEVENTY_ENV === 'prod';

module.exports = () => {
  const files = [
    'resourceCSS.json',
    'resourceJS.json',
    '../_includes/layout.njk',
  ];

  let version = '';

  try {
    version = hashForFiles(...files.map((f) => path.join(__dirname, f)));
  } catch (e) {
    // Don't explode in dev if the resource doesn't exist yet.
    if (isProd || e.code !== 'ENOENT') {
      throw e;
    }
    console.warn('failed to generate resourceVersion', e);
  }

  return {
    version,
  };
};
