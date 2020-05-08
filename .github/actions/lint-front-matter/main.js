const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const getFrontMatter = require('./utils/get-front-matter');
const sortResultsByStatus = require('./utils/sort-results-by-status');
const combineByFile = require('./utils/combine-by-file');
// const logOutput = require('./utils/log-output');

/**
 * Get added, modified, and all files affected by the PR.
 * @return {Object}
 */
function getFiles() {
  // Get the list of added and modified files.
  // Combine these to create the all files list.
  // nb. Inputs come in as a space separated list of file paths.
  const addedFiles = core.getInput('added').length
    ? core.getInput('added').split(' ')
    : [];
  const modifiedFiles = core.getInput('modified').length
    ? core.getInput('modified').split(' ')
    : [];
  const allFiles = [...addedFiles, ...modifiedFiles];
  return {addedFiles, modifiedFiles, allFiles};
}

/**
 * Fetch the .frontmatterrc.js file.
 * @return {Object} The contents of the .frontmatterrc file.
 */
function getConfig() {
  return require(path.join(__dirname, '.frontmatterrc.js'));
}

/**
 * Return all labels on the PR that start with the prefix.
 * Strip off the prefix in the process.
 * E.g. 'ignore: foo-bar' becomes 'foo-bar'.
 * @param {{payload: !Object}} context A GitHub Pull Request context object.
 * @param {string=} prefix The label prefix to filter by. Defaults to 'ignore:'.
 * @return {string[]} A list of ids of rules to be ignored.
 */
function getIgnoredLabels(context, prefix = 'ignore:') {
  return context.payload.pull_request.labels
    .filter((label) => {
      return label.startsWith(prefix);
    })
    .map((label) => label.substring(prefix.length).trim());
}

/**
 * Takes a list of rule id's and filters them out of a config file.
 * @param {Object} config The JSONified version of .frontmatterrc.js
 * @param {string[]} labels An array of ids of rules that should be ignored.
 * @return {Object} A new config object with ignored rules removed.
 */
function filterConfigByLabels(config, labels) {
  const out = {};
  for (let [key, rules] of Object.entries(config)) {
    rules = rules.filter((rule) => !labels.includes(rule.id));
    out[key] = rules;
  }
  return out;
}

/**
 * For each key in .frontmatterrc,
 * loop through the array of rules, require each rule and attach to the object.
 * Modifies the config object in place.
 * @param {Object} config The .frontmatterrc config object.
 */
function requireRules(config) {
  for (const rules of Object.values(config)) {
    for (const rule of rules) {
      rule.ruleClass = require(path.join(__dirname, 'rules', rule.id));
    }
  }
}

/**
 * For every file, fetch its frontMatter, then run every rule against it.
 * Finally, sort results by file and status.
 * @param {string[]} files An array of paths to files.
 * @param {Array<{id: !string, args: string[]}>} rules An array of rules
 * objects containing ids and optional arugments to pass to the rules.
 * @return {Array<{file: string, passes: Array, failures: Array, warnings:
 * Array}>}
 */
function lint(files, rules) {
  return Promise.all(files.map(getFrontMatter)).then((filesAndFrontMatter) => {
    return filesAndFrontMatter.map(({file, frontMatter}) => {
      const results = rules.map((rule) => {
        return rule.ruleClass.test({file, frontMatter, args: rule.args});
      });
      return sortResultsByStatus(file, results);
    });
  });
}

async function run() {
  try {
    // Get all of the files touched in the PR.
    const {allFiles, addedFiles, modifiedFiles} = getFiles();

    // Get the configuration file and remove any skipped rules.
    const config = filterConfigByLabels(
      getConfig(),
      getIgnoredLabels(github.context),
    );

    // Require the rule functions and attach them to the config object.
    requireRules(config);

    // For each list of files (added, modified, all),
    // lint them using their respective rules found in the config file.
    let results = await Promise.all([
      lint(allFiles, config.allFiles),
      lint(addedFiles, config.addedFiles),
      lint(modifiedFiles, config.modifiedFiles),
    ]);
    results = combineByFile(results.flat());

    // If we're running in the GH Actions environment,
    // merge all results into a Object keyed by the file names.
    if (process.env.GITHUB_ACTIONS) {
      logOutput(results);
    } else {
      return results;
    }
  } catch (err) {
    console.error(err);
    core.setFailed();
  }
}

// Only run the action if it's being executed as part of a GH Actions workflow.
// Prevents the action from running when we require it in our tests.
if (process.env.GITHUB_ACTIONS) {
  run();
}

module.exports = {run};
