const assert = require('assert');
const path = require('path');
const proxyquire = require('proxyquire');

/**
 * proxyquire lets us require this module multiple times and replace its dependencies.
 * This module depends on @actions/github which contains the context for the PR.
 * By using reRequire, we can change the state of @actions/github and make it
 * seem like the PR has labels.
 */
const modulePath = '../../../../../../.github/actions/lint-front-matter/linters/modified-files';
let allFiles;
let githubStub;

describe('modified-files', function() {
  beforeEach(function() {
    githubStub = {};
    modifiedFiles = proxyquire(modulePath, {'@actions/github': githubStub});
  });

  it('should return nothing if no files match', async function() {
    const files = [];
    const actual = await modifiedFiles(files);
    assert.deepEqual(actual, []);
  });

  it('should return results array if files match', async function() {
    // Mock the github actions context object.
    // This mock makes it seem like the pull request has no labels on it.
    githubStub.context = {
      payload: {
        pull_request: {
          labels: [],
        },
      },
    };

    const files = [path.join(__dirname, 'fixtures', 'my-post', 'index.md')];
    const actual = await modifiedFiles(files);
    assert.deepEqual(actual.length, 1);
    // Verify properties exist on results object.
    assert.ok(actual[0].passes);
    assert.ok(actual[0].failures);
    assert.ok(actual[0].warnings);
  });
});