const github = require('@actions/github');
const {SKIP_TAGS_LABEL} = require('../utils/constants');

/**
 * Check if the tags has been approved by the reviewer.
 * This is done through adding a label to the pull request.
 * @return {boolean}
 */
const skipTagsTests = () => {
  const context = github.context;
  return context.payload.pull_request.labels.some(
    (label) => label.name === SKIP_TAGS_LABEL,
  );
};

module.exports = skipTagsTests;
