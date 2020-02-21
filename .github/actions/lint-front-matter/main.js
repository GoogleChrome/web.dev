const core = require('@actions/core');
const getMarkdownFiles = require('./utils/get-markdown-files');
const lintAllFiles = require('./linters/all-files');
const lintAddedFiles = require('./linters/added-files');
const lintModifiedFiles = require('./linters/modified-files');

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