/**
 * @fileoverview This file compares the current commit SHA against the one
 * of the deployed site. If they are different the build is allowed to
 * continue, otherwise the build is cancelled.
 */

const fetch = require('node-fetch');
const {Octokit} = require('@octokit/action');

const octokit = new Octokit();
const ERROR_MESSAGE = 'NOT FOUND';

/**
 * @returns {Promise<string>}
 */
const getDeployedVersion = () => {
  // @ts-ignore
  return fetch('https://web.dev/version')
    .then((res) => (res.ok ? res.text() : ERROR_MESSAGE))
    .catch(() => ERROR_MESSAGE);
};

(async () => {
  const deployedVersion = await getDeployedVersion();
  const currentVersion = process.env.GITHUB_SHA;
  const run_id = Number(process.env.GITHUB_RUN_ID);

  console.log(`Current version: ${currentVersion}`);
  console.log(`Deployed version: ${deployedVersion}`);

  if (deployedVersion === currentVersion) {
    console.log(
      'The current and deployed versions are the same, stopping build.',
    );
    await octokit.actions.cancelWorkflowRun({
      owner: 'GoogleChrome',
      repo: 'web.dev',
      run_id,
    });
  } else {
    console.log(
      'The current and deployed versions are different, continuing build.',
    );
  }
})();
