const core = require('@actions/core');
const github = require('@actions/github');

function run() {
  const prLabels = github.context.payload.pull_request.labels;
  const labelsToBlock = core.getInput('labels');
  for (const label of labelsToBlock) {
    if (prLabels.includes(label)) {
      core.setFailed();
    }
  }
}

run();
