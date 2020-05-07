/**
 * @fileoverview Verify posts with a hero image provide alt text for that hero.
 */

const id = 'has-alt-text';
const Rule = require('./rule');
const {ok, fail} = require('../utils/status');

/**
 * @param {Object} yaml The yaml front matter from the file.
 * @return {Object} The result of the check and any failure/warning messages.
 */
const test = (yaml) => {
  if ('hero' in yaml) {
    if (!('alt' in yaml) || yaml.alt === '') {
      return fail(`Missing alt text property in YAML front matter.`);
    }
  }

  return ok();
};

module.exports = new Rule(id, test);
