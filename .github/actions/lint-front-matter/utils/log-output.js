const core = require('@actions/core');
const createMessage = require('./create-message');

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
