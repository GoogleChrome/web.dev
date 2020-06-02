/**
 * @fileoverview Find the first comment by a specific author.
 */

const github = require('@actions/github');
const core = require('@actions/core');

/**
 * @param {Object} octokit The GitHub OctoKit library object.
 * @param {Object} pr The PR object associated with the webhook event.
 * @return {string}
 */
async function getCommentId(octokit, pr) {
  core.debug(`Fetching comments for #${pr.number}`);
  const {data: comments} = await octokit.issues.listComments({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pr.number,
  });

  const author = core.getInput('author');
  core.debug(`Looking for first comment by #${author}`);
  const comment = comments.find((comment) => comment.user.login === author);
  return comment ? comment.id : '';
}

async function run() {
  try {
    const token = core.getInput('token');
    const octokit = new github.GitHub(token);

    const pr = github.context.payload.pull_request;
    if (!pr) {
      core.setFailed(
        'Could not get pull request number from context, exiting.',
      );
      return;
    }

    const commentId = await getCommentId(octokit, pr);
    // setOutput doesn't support numbers so we stringify it.
    // https://github.com/actions/toolkit/issues/321
    core.setOutput('comment-id', `${commentId}`);
  } catch (err) {
    console.error(err);
    core.setFailed();
  }
}

run();
