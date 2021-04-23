/**
 * @fileoverview This file compares the current commit SHA against the one
 * of the deployed site. If they are different the build is allowed to
 * continue, otherwise the build is cancelled.
 */

const fetch = require('node-fetch');
const {execSync} = require('child_process');
const {CloudBuildClient} = require('@google-cloud/cloudbuild');

const client = new CloudBuildClient();

/**
 * @returns {Promise<string>}
 */
const getDeployedVersion = () => {
  // @ts-ignore
  return fetch('https://web.dev/version')
    .then((res) => (res.ok ? res.text() : 'NOT FOUND'))
    .catch(() => 'NOT FOUND');
};

(async () => {
  const deployedVersion = await getDeployedVersion();
  const currentVersion = execSync('git rev-parse HEAD').toString().trim();

  console.log(`Current version: ${currentVersion}`);
  console.log(`Deployed version: ${deployedVersion}`);

  if (deployedVersion === currentVersion) {
    console.log(
      'The current and deployed versions are the same, stopping build.',
    );
    client.cancelBuild({
      id: process.env.BUILD_ID,
      projectId: process.env.PROJECT_ID,
    });
  } else {
    console.log(
      'The current and deployed versions are different, continuing build.',
    );
  }
})();
