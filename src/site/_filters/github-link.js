const path = require('path');
const repo = require('../_data/site').repo;

module.exports = (inputPath) => {
  if (!inputPath) {
    /* eslint-disable-next-line */
    console.warn(
      'inputPath passed to githubLink filter was undefined or null.'
    );
  }
  const branch = `master`;
  return path.join(repo, 'blob', branch, inputPath);
};
