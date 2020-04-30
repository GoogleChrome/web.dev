const assert = require('assert');
const path = require('path');
// ensure we don't get any module from the cache, but to load it fresh every time
const proxyquire = require('proxyquire');
const {SKIP_URL_LABEL} = require('../../../../../../.github/actions/lint-front-matter/utils/constants');

/**
 * proxyquire lets us require this module multiple times and replace its dependencies.
 * This module depends on @actions/github which contains the context for the PR.
 * By using reRequire, we can change the state of @actions/github and make it
 * seem like the PR has labels.
 */
let addedFiles;
const modulePath = '../../../../../../.github/actions/lint-front-matter/linters/added-files';
let githubStub;

describe('added-files', function() {
  beforeEach(function() {
    githubStub = {};
    addedFiles = proxyquire(modulePath, {'@actions/github': githubStub});
  });

  it('should return nothing if no files match', async function() {
    const files = [];
    const actual = await addedFiles(files);
    assert.deepEqual(actual, []);
  });

  it('should run url tests if not skipped', async function() {
    // Mock the github actions context object.
    // This mock makes it seem like the pull request has no labels on it.
    githubStub.context = {
      payload: {
        pull_request: {
          labels: [],
        },
      },
    }

    const files = [path.join(__dirname, 'fixtures', 'my-post', 'index.md')];
    const actual = await addedFiles(files);
    assert.deepEqual(actual.length, 1);
    assert.deepEqual(actual[0].passes.length, 2);
  });

  it('should skip url tests if label is applied', async function() {
    // Mock the github actions context object.
    // This mock makes it seem like the pull request has a skip label on it.
    githubStub.context = {
      payload: {
        pull_request: {
          labels: [{name: SKIP_URL_LABEL}],
        },
      },
    };

    const files = [path.join(__dirname, 'fixtures', 'my-post', 'index.md')];
    const actual = await addedFiles(files);
    assert.deepEqual(actual.length, 1);
    assert.deepEqual(actual[0].passes.length, 0);
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
    const actual = await addedFiles(files);
    assert.deepEqual(actual.length, 1);
    // Verify properties exist on results object.
    assert.ok(actual[0].passes);
    assert.ok(actual[0].failures);
    assert.ok(actual[0].warnings);
  });
});