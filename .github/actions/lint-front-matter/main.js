const core = require('@actions/core');
const getMarkdownFiles = require('./utils/get-markdown-files.js.js');
const lintAllFiles = require('./linters/all-files.js.js');
const lintAddedFiles = require('./linters/added-files.js.js');
const lintModifiedFiles = require('./linters/modified-files.js.js');

try {
  const added = getMarkdownFiles(core.getInput('added'));
  const modified = getMarkdownFiles(core.getInput('modified'));
  const all = [...added, ...modified];

  (async () => {
    [
      ...(await lintAllFiles(all)),
      ...(await lintAddedFiles(added)),
      ...(await lintModifiedFiles(modified))
    ].forEach((failure) => core.setFailed(failure));
  })();
} catch(err) {
  core.setFailed(err);
}