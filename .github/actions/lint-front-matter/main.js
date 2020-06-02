/**
 * @fileoverview Main entrypoint for front matter linter.
 * Handles parsing the config file, and running linter rules against
 * added/modified/all files.
 */

const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const getFrontMatter = require('./utils/get-front-matter');
const sortResultsByStatus = require('./utils/sort-results-by-status');
const combineByFile = require('./utils/combine-by-file');
const logOutput = require('./utils/log-output');

/**
 * @typedef {{
 *  id: string,
 *  args?: string[]
 * }} ConfigRule - Represents a linter rule.
 * These can be organized in a config file to express which rules should run
 * against each category of changed files.
 */

/**
 * @typedef {{
 *  addedFiles: ConfigRule[],
 *  modifiedFiles: ConfigRule[],
 *  allFiles: ConfigRule[]
 * }} Config - An object that defines which rules should run for
 * each category (added/modified/all) of changed files.
 * This object is exported from the .frontmatterrc.js file.
 */

/**
 * @typedef {import('./rules/rule').TestResult} TestResult
 * @typedef {{
 *  file: string,
 *  passes: TestResult[],
 *  failures: TestResult[],
 *  warnings: TestResult[]
 * }} TestResults - An object representing all of the test results for a single
 * file.
 */

/**
 * Get added, modified, and all files affected by the PR.
 * @param {string} addedFiles Files that were added in the PR.
 * @param {string} modifiedFiles Files that were modified in the PR.
 * @return {{addedFiles: string[], modifiedFiles: string[], allFiles: string[]}}
 */
function getChangedFiles(addedFiles, modifiedFiles) {
  // Get the list of added and modified files.
  // Combine these to create the all files list.
  // nb. Inputs come in as a space separated list of file paths.
  addedFiles = addedFiles.length ? addedFiles.split(' ') : [];
  modifiedFiles = modifiedFiles.length ? modifiedFiles.split(' ') : [];
  const allFiles = [...addedFiles, ...modifiedFiles];
  return {addedFiles, modifiedFiles, allFiles};
}

/**
 * Fetch the configuration file and return its contents.
 * @return {Config}
 */
function getConfig() {
  return require(path.join(__dirname, '.frontmatterrc.js'));
}

/**
 * Return all labels on the PR that start with the prefix. Strip off the prefix
 * in the process. E.g. 'ignore: foo-bar' becomes 'foo-bar'.
 * @param {{payload: Object}} context A GitHub Pull Request context object.
 * @param {string} [prefix=ignore:] The label prefix to filter by.
 * @return {string[]} A list of ids of rules to be ignored.
 */
function getIgnoredLabels(context, prefix = 'ignore:') {
  return context.payload.pull_request.labels
    .filter((label) => {
      return label.name.startsWith(prefix);
    })
    .map((label) => label.name.substring(prefix.length).trim());
}

/**
 * Take a list of ids and filters them out of the config.
 * @param {Config} config
 * @param {string[]} rulesToIgnore ids of rules that should be ignored.
 * @return {Config} A copy of the config object with ignored rules removed.
 */
function filterConfigByLabels(config, rulesToIgnore) {
  const out = {};
  for (let [key, rules] of Object.entries(config)) {
    rules = rules.filter((rule) => !rulesToIgnore.includes(rule.id));
    out[key] = rules;
  }
  return out;
}

/**
 * For every file, fetch its frontMatter, then run every rule against it.
 * Finally, sort results by file and status.
 * @param {string[]} files
 * @param {Array<ConfigRule>} rules
 * @return {Array<TestResults>}
 */
function lint(files, rules) {
  return Promise.all(files.map(getFrontMatter)).then((filesAndFrontMatter) => {
    return filesAndFrontMatter.map(({file, frontMatter}) => {
      const results = rules.map((rule) => {
        const ruleFn = require(path.join(__dirname, 'rules', rule.id));
        return ruleFn.test({file, frontMatter, args: rule.args});
      });
      return sortResultsByStatus(file, results);
    });
  });
}

async function run() {
  try {
    // Get all of the files touched in the PR.
    const {allFiles, addedFiles, modifiedFiles} = getChangedFiles(
      core.getInput('added'),
      core.getInput('modified'),
    );

    // Get the configuration file and remove any skipped rules.
    const config = filterConfigByLabels(
      getConfig(),
      getIgnoredLabels(github.context),
    );

    // For each list of files (added, modified, all),
    // lint them using their respective rules found in the config file.
    let results = await Promise.all([
      lint(allFiles, config.allFiles),
      lint(addedFiles, config.addedFiles),
      lint(modifiedFiles, config.modifiedFiles),
    ]);
    // Merge all results into a Object keyed by the file names.
    results = combineByFile(results.flat());

    // If we're running in the GH Actions environment,
    // log the results. Otherwise, just return them.
    if (process.env.NODE_ENV === 'test') {
      return results;
    } else {
      logOutput(results);
    }
  } catch (err) {
    console.error(err);
    core.setFailed();
  }
}

// Prevent the action from running when we require it in our tests locally
// or as part of our CI.
if (process.env.NODE_ENV !== 'test') {
  run();
}

module.exports = {run};
