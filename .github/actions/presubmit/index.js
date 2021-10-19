/**
 * @file This action checks if the `$-presubmit` label has been added to a Pull Request.
 * If the label exists, then remove the label and allow the rest of the workflow the
 * action belongs to to continue. If not fail the action causing the workflow to fail.
 *
 * This is done so we can execute a workflow only when the PR is ready for a more thorough
 * review and testing.
 */

const core = require('@actions/core');
const github = require('@actions/github');

const LABEL = '$-presubmit';

/**
 * Checks if `$-presubmit` label is on PR.
 * If there is a `$-presubmit` label then remove the label and allow workflow to continue.
 * If there is no `$-presubmit` label fail the workflow.
 */
async function run() {
  const githubToken = core.getInput('github_token', {required: true});
  const isPresubmit = core.getBooleanInput('is_presubmit', {required: true});
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const issue_number = core.getInput('number')
    ? parseInt(core.getInput('number'))
    : github.context.issue.number;
  const octokit = github.getOctokit(githubToken);

  if (isPresubmit) {
    try {
      await octokit.rest.issues.removeLabel({
        name: LABEL,
        owner,
        repo,
        issue_number,
      });
      core.info(`Succeeded to remove label: ${LABEL}`);
    } catch (e) {
      core.warning(`Failed to remove label: ${LABEL}`);
    }
  } else {
    core.warning(`Pull request does not have label: ${LABEL}`);
  }

  core.setOutput('isPresubmit', isPresubmit);
}

run();
