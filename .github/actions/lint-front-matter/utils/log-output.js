/**
 * @fileoverview Output the results of the linter to the GitHub Actions
 * workflow so another action can ingest and display those results.
 * This utility will also handle setting the state (pass/fail) of the GitHub
 * Action itself.
 */

const core = require('@actions/core');
const createMessage = require('./create-message');

/** @typedef {import('./combine-by-file').ResultsByFile} ResultsByFile */

/**
 * @param {ResultsByFile} files
 */
module.exports = (files) => {
  for (const [file, results] of Object.entries(files)) {
    const {failures} = results;
    if (failures.length) {
      for (failure of failures) {
        core.setFailed(`${file}\n${failure.message}\n`);
      }
    }
  }
  core.setOutput('message', createMessage(files));
};
