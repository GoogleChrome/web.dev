const assert = require('assert');
const byteof = require('byteof');
const {expect} = require('chai');
const fs = require('fs');
const path = require('path');
const util = require('util');

const {maxItemSizeInBytes} = require('../../algolia');

const exec = util.promisify(require('child_process').exec);
const rootDir = path.resolve(__dirname, '..', '..');
const pagesJsonPath = path.join(rootDir, 'dist', 'pages.json');
const algoliaJsonPath = path.join(rootDir, '.tmp', 'algolia.json');

/**
 *
 * @param {AlgoliaItem[]} algoliaItems
 * @param {(algoliaItem: AlgoliaItem, errorRef: string) => void} [additionalTests]
 */
function checkAlgoliaItem(algoliaItems, additionalTests) {
  // Check each element
  for (const algoliaItem of algoliaItems) {
    const errorRef = `check ${algoliaItem.objectID} (${path.join(
      algoliaItem.locale,
      algoliaItem.url,
    )})`;
    // Check element has required fields
    expect(algoliaItem, errorRef)
      .to.be.an('object')
      .to.include.all.keys(
        'locale',
        'objectID',
        'priority',
        'tags',
        'title',
        'url',
      );

    expect(algoliaItem.locale, errorRef).to.be.a('string');
    expect(algoliaItem.objectID, errorRef).to.be.a('string');
    expect(algoliaItem.priority, errorRef).to.be.a('number');
    expect(algoliaItem.tags, errorRef).to.be.an.instanceof(Array);
    expect(algoliaItem.title, errorRef).to.be.a('string');
    expect(algoliaItem.url, errorRef).to.be.a('string');

    if (algoliaItem.content) {
      expect(algoliaItem.content, errorRef).to.be.a('string');
    }
    if (algoliaItem.createdOn) {
      expect(algoliaItem.createdOn, errorRef).to.be.a('string');
      expect(
        () => new Date(algoliaItem.createdOn).toISOString(),
        errorRef,
      ).to.not.throw();
    }
    if (algoliaItem.description) {
      expect(algoliaItem.description, errorRef).to.be.a('string');
    }
    if (algoliaItem.image) {
      expect(algoliaItem.image, errorRef).to.be.a('string');
    }

    if (additionalTests) {
      additionalTests(algoliaItem, errorRef);
    }
  }
}

describe('Algolia test', function () {
  before(async function () {
    // Disable the timeout as it'll take build a little while to finish.
    // eslint-disable-next-line
    this.timeout(0);
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      console.log(
        '`dist` folder already exists, build completed. Starting tests.',
      );
    } else {
      console.log('Running `npm run build`...');
      await exec('ELEVENTY_ENV=prod npm run build');
      console.log('Build completed. Starting tests.');
    }
  });

  it('`src/site/content/pages.njk` generates the expected files', async function () {
    // Check `pages.json` exists
    assert.ok(
      fs.existsSync(pagesJsonPath),
      `Could not find '${pagesJsonPath}'`,
    );

    /** @type {AlgoliaItem[]} */
    const pages = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf8'));
    checkAlgoliaItem(pages);
  });

  it('`algolia.js` generates the expected data object', async function () {
    // Generate data object
    if (!fs.existsSync(algoliaJsonPath)) {
      console.log('Running `npm run algolia`...');
      await exec('ELEVENTY_ENV=test npm run algolia');
      console.log('Algolia script completed. Starting tests.');
    }

    // Check `algolia.json` exists
    assert.ok(
      fs.existsSync(algoliaJsonPath),
      `Could not find '${algoliaJsonPath}'`,
    );

    /** @type {AlgoliaItem[]} */
    const pages = JSON.parse(fs.readFileSync(algoliaJsonPath, 'utf8'));
    checkAlgoliaItem(pages, (algoliaItem, errorRef) => {
      // Check element has required fields
      expect(algoliaItem, errorRef).to.include.all.keys('indexedOn', 'locales');
      expect(algoliaItem.indexedOn, errorRef).to.be.a('number');
      expect(algoliaItem.tags, errorRef).to.be.an.instanceof(Array);
      expect(byteof(algoliaItem), errorRef).to.be.at.most(maxItemSizeInBytes);
    });
  });
});
