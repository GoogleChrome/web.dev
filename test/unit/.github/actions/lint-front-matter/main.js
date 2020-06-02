const assert = require('assert');
const path = require('path');
const proxyquire = require('proxyquire').noCallThru();
const {failStatus} = require('../../../../../.github/actions/lint-front-matter/utils/status');

/**
 * proxyquire lets us require this module multiple times and replace its dependencies.
 * This module depends on @actions/github which contains the context for the PR.
 * By using reRequire, we can change the state of @actions/github and make it
 * seem like the PR has labels.
 */
const modulePath = '../../../../../.github/actions/lint-front-matter/main';
let main;
let coreStub;
let githubStub;

describe('main', function() {
  beforeEach(function() {
    coreStub = {};
    githubStub = {};
  });

  afterEach(function() {
    main = null;
  });

  it('should return results for added files', async function() {
    // Mock the @actions/core object.
    // This mock makes it seem like there was one added file.
    coreStub.getInput = function(type) {
      if (type === 'added') {
        // GitHub Actions tend to pass arguments to one another as space
        // separated strings. ¯\_(ツ)_/¯
        return [
          path.join(__dirname, 'fixtures', 'no-date', 'index.md'),
          path.join(__dirname, 'fixtures', 'no-updated', 'index.md'),
        ].join(' ');
      }

      return '';
    }

    // Mock the @action/github object.
    // This mock makes it seem like the pull request has no labels on it.
    githubStub.context = {
      payload: {
        pull_request: {
          labels: [],
        },
      },
    }

    main = proxyquire(modulePath, {
      '@actions/core': coreStub,
      '@actions/github': githubStub,
    });

    const results = await main.run();
    const [firstPost, secondPost] = Object.values(results);
    assert.ok(firstPost.failures.length);
    assert.strictEqual(firstPost.failures[0].status, failStatus);
    assert.ok(secondPost.failures.length === 0);
  });

  it('should return results for modified files', async function() {
    coreStub.getInput = function(type) {
      if (type === 'modified') {
        return [
          path.join(__dirname, 'fixtures', 'no-updated', 'index.md'),
        ].join(' ');
      }

      return '';
    }

    githubStub.context = {
      payload: {
        pull_request: {
          labels: [],
        },
      },
    }

    main = proxyquire(modulePath, {
      '@actions/core': coreStub,
      '@actions/github': githubStub,
    });

    const results = await main.run();
    const [firstPost] = Object.values(results);
    assert.ok(firstPost.failures.length);
    const failure = firstPost.failures[0];
    assert.strictEqual(failure.status, failStatus);
    // Verifies the rule that checks for the `updated` property
    // ran against the modified file.
    assert.strictEqual(failure.id, 'has-property');
    assert.ok(failure.message.includes('updated'));
  });

  it('should skip audits with ignore labels', async function() {
    coreStub.getInput = function(type) {
      if (type === 'modified') {
        return [
          path.join(__dirname, 'fixtures', 'no-updated', 'index.md'),
        ].join(' ');
      }

      return '';
    }

    githubStub.context = {
      payload: {
        pull_request: {
          labels: [{name: 'ignore: has-property'}],
        },
      },
    }

    main = proxyquire(modulePath, {
      '@actions/core': coreStub,
      '@actions/github': githubStub,
    });

    const results = await main.run();
    const [firstPost] = Object.values(results);
    assert.strictEqual(firstPost.failures.length, 0);
  });
});