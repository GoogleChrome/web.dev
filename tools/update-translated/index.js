/**
 * @fileoverview Task for updating `translate` frontmatter field.
 *
 * Example: npm run translated && git commit -am 'Updated translated date for some blog posts'
 */

const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

const RE_UPDATED = /^translated:\s?(.*?)\n/m;
const translatedFileRegExp = /site\/content\/(?!en).*\/(.*)\.md/;

function isTranslatedFile(fileName) {
  return fileName.match(translatedFileRegExp);
}

const run = async () => {
  const fileNames = process.argv.slice(2)[0].slice(1, -1).split(',');
  const translatedFiles = fileNames.filter(isTranslatedFile);

  for (const fileName of translatedFiles) {
    const now = moment().format('YYYY-MM-DD');
    let originalTranslated;
    let newTranslated;

    const changedFile = path.join(__dirname, '../..', fileName);
    const fileContents = await fs.readFile(changedFile, 'utf-8');
    const matched = RE_UPDATED.exec(fileContents);
    if (!matched) {
      // Translated field not present yet - append it to the frontmatter.
      originalTranslated = '\n---\n';
      newTranslated = `\ntranslated: ${now}\n---\n`;
    } else {
      originalTranslated = matched[0];
      newTranslated = `translated: ${now}\n`;
    }

    const newContents = fileContents.replace(originalTranslated, newTranslated);
    await fs.writeFile(changedFile, newContents);
    console.log(`Set translated: ${now} for ${changedFile}`);
  }
};

run();
