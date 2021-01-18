/**
 * @fileoverview Task for updating `translate` frontmatter field.
 *
 * Example: npm run translated && git commit -am 'Updated translated date for some blog posts'
 */

const fs = require('fs');
const path = require('path');
const moment = require('moment');

const translatedFileRegExp = /site\/content\/(?!en).*\/(.*)\.md/;

function isTranslatedFile(fileName) {
  return fileName.match(translatedFileRegExp);
}

const run = async () => {
  const fileNames = process.argv.slice(2)[0].slice(1, -1).split(',');
  const translatedFiles = fileNames.filter(isTranslatedFile);

  for (const fileName of translatedFiles) {
    const now = moment().format('YYYY-MM-DD');
    const changedFile = path.join(__dirname, '../..', fileName);
    const newFile = changedFile.replace('index.md', 'index.json');
    const content = fs.existsSync(newFile)
      ? JSON.parse(fs.readFileSync(newFile))
      : {};
    content['translated'] = now;
    fs.writeFileSync(newFile, JSON.stringify({translated: now}));
    console.log(`Set translated: ${now} for ${changedFile}`);
  }
};

run();
