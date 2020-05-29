/**
 * @fileoverview Verify posts with a hero image provide alt text for that hero.
 */

const id = 'has-alt-text';
const Rule = require('./rule');
const {ok, fail} = require('../utils/status');

/** @typedef {import('../utils/status').Status} Status */

/**
 * @param {Object} frontMatter The yaml front matter from the file.
 * @return {Status}
 */
const test = ({frontMatter}) => {
  if ('hero' in frontMatter) {
    if (!('alt' in frontMatter) || frontMatter.alt === '') {
      return fail(`Missing alt text property in YAML front matter.`);
    }
  }

  return ok();
};

module.exports = new Rule(id, test);
