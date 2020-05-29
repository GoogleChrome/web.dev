/**
 * @fileoverview Verify tags used in posts also appear in postTags.js. We only
 * display tags in our UI if they are present in postTags.js.
 */

const id = 'tags-are-valid';
const Rule = require('./rule');
const {ok, fail} = require('../utils/status');
const postTags = require('../../../../src/site/_data/postTags');

/** @typedef {import('../utils/status').Status} Status */

/**
 * @param {Object} frontMatter The yaml front matter from the file.
 * @return {Status}
 */
const test = ({frontMatter}) => {
  const invalidTags = [];

  if ('tags' in frontMatter) {
    if (Array.isArray(frontMatter.tags)) {
      frontMatter.tags.forEach((tag) => {
        if (!(tag in postTags)) {
          invalidTags.push(tag);
        }
      });
    } else {
      return fail(`Missing tags field in YAML front matter.`);
    }
  }

  if (invalidTags.length) {
    // prettier-ignore
    return fail(`Invalid tags: [${invalidTags.join(', ')}]. Only use tags found in _data/postTags.js`);
  }

  return ok();
};

module.exports = new Rule(id, test);
