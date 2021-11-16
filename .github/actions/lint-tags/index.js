/**
 * @file This action checks if the tags used in posts exist in the
 * yaml file that defines all supported tags.
 */
const core = require('@actions/core');
const fs = require('fs');
const glob = require('fast-glob');
const matter = require('gray-matter');
const yaml = require('js-yaml');
const path = require('path');

function run() {
  const tagsYmlInput = 'src/site/_data/i18n/tags.yml';
  const tagsYmlPath = path.join(process.cwd(), tagsYmlInput);
  /** @type {{[tag: string]: any}} */
  const tags = yaml.load(fs.readFileSync(tagsYmlPath, 'utf-8')) || {};
  if (Object.keys(tags).length === 0) {
    core.setFailed(`No tags found, check file "${tagsYmlInput}"`);
  }

  const postsPathInput = 'src/site/content';
  const postsGlob = path.join(process.cwd(), postsPathInput, '{**/*,*}.md');
  const postsPaths = glob.sync(postsGlob, {});

  const ignoreTags = ['blog', 'test-post'];
  // Add tags to ignore to our tags master list
  for (const ignoreTag of ignoreTags) {
    tags[ignoreTag] = true;
  }

  let tagErrorCount = 0;

  // Validate all posts to see if there are any invalid tags
  for (const postPath of postsPaths) {
    const fileData = fs.readFileSync(postPath, 'utf8');
    const data = matter(fileData).data;

    // If `data.tags` is a string rather than an array, turn it into an array
    if (typeof data.tags === 'string') {
      data.tags = [data.tags];
      // If `data.tags` isn't a string or an array set it to an empty array
    } else if (!Array.isArray(data.tags)) {
      data.tags = [];
    }

    for (const tag of data.tags) {
      if (!(tag in tags) && !tag.startsWith('chrome-')) {
        tagErrorCount++;
        core.warning(
          `ERROR IN FILE: ${postPath.replace(
            process.cwd(),
            '',
          )}, "${tag}" is not a valid tag`,
        );
      }
    }
  }

  if (tagErrorCount !== 0) {
    core.setFailed(`Found ${tagErrorCount} instance(s) of invalid tags used`);
  }
}

run();
