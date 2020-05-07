/**
 * @fileoverview Verify the url matches the sluggified post title. Having a post
 * title that's wildly different from the url makes it difficult to find the
 * post in the project and update it.
 */

const id = 'url-matches-title';
const Rule = require('./rule');
const path = require('path');
const slugify = require('slugify');
const {ok, fail} = require('../utils/status');

/**
 * @param {string} file Filename of the file being linted.
 * @param {Object} yaml The yaml front matter from the file.
 * @return {Object} The result of the check and any failure/warning messages.
 */
const test = (file, yaml) => {
  const dirname = path
    .dirname(file)
    .split('/')
    .pop();
  const sluggifiedTitle = slugify(yaml.title, {lower: true, strict: true});

  if (dirname !== sluggifiedTitle) {
    return fail('URL does not match title.', {
      expected: sluggifiedTitle,
      actual: dirname,
    });
  }

  return ok();
};

module.exports = new Rule(id, test);
