const id = 'tags-are-valid';
const Rule = require('./rule');
const {ok, fail} = require('../utils/status');
const postTags = require('../../../../src/site/_data/postTags');
/**
 * @param {Object} yaml The yaml front matter from the file.
 * @return {Array<Object>} The result of the check and any failure/warning messages.
 */
const test = (yaml) => {
  const invalidTags = [];

  if ('tags' in yaml) {
    if (Array.isArray(yaml.tags)) {
      yaml.tags.forEach((tag) => {
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
