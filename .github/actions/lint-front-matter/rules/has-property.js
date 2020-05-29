/**
 * @fileoverview Verify the specified property exists in the file's YAML.
 */

const id = 'has-property';
const Rule = require('./rule');
const {ok, fail} = require('../utils/status');

/** @typedef {import('../utils/status').Status} Status */

/**
 * @param {Object} frontMatter The yaml front matter from the file.
 * @param {string} property The name of the property to check for.
 * @return {Status}
 */
const test = ({frontMatter, args}) => {
  const [property] = args;
  if (!(property in frontMatter) || frontMatter[property] === '') {
    return fail(`Missing \`${property}\` in YAML front matter.`);
  }

  return ok();
};

module.exports = new Rule(id, test);
