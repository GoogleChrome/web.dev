const id = 'tags-are-valid';
const Rule = require('./rule');
const {ok, fail, warn} = require('../utils/status');
const postTags = require('../../../../src/site/_data/postTags');
/**
 * @param {string} file Filename of the file being linted.
 * @param {Object} yaml The yaml front matter from the file.
 * @param {Boolean} warningFlag Don't throw error when invalid tag is used.
 * @return {Array<Object>} The result of the check and any failure/warning messages.
 */
const test = (file, yaml, warningFlag = false) => {
  const errorStatus = warningFlag ? warn : fail;
  const errors = [];

  if ('tags' in yaml) {
    if (Array.isArray(yaml.tags)) {
      yaml.tags.forEach((tag) => {
        if (!(tag in postTags)) {
          errors.push(
            errorStatus(
              `Tag "${tag}" is not found in \`_data/postTags\`.` +
                `Please update "${file}" with the correct tags`,
            ),
          );
        }
      });
    } else {
      errors.push(errorStatus('Tags was not an array.'));
    }
  }

  return errors.length ? errors : [ok()];
};

module.exports = new Rule(id, test);
