const github = require('@actions/github');
const {SKIP_URL_LABEL} = require('../utils/constants');

/**
 * Check if the url has been approved by the reviewer.
 * This is done through adding a label to the pull request.
 * @return {boolean}
 */
const skipUrlTests = () => {
  const context = github.context;
  return context.payload.pull_request.labels.some(
    (label) => label.name === SKIP_URL_LABEL,
  );
};

module.exports = skipUrlTests;
