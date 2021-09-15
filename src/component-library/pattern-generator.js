const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const pathIndex = process.argv.indexOf('-p');
const nameIndex = process.argv.indexOf('-n');
const titleIndex = process.argv.indexOf('-t');
const skipMarkupIndex = process.argv.indexOf('-sm');
const basePath = [process.cwd(), 'src', 'components', 'patterns'];

// Set up the chalk warning and error states
const warning = chalk.black.bgYellow;
const error = chalk.black.bgRed;
const success = chalk.black.bgGreen;

if (pathIndex > 0 && nameIndex > 0) {
  const newPath = process.argv.slice(pathIndex + 1)[0];
  const name = process.argv.slice(nameIndex + 1)[0];
  const title = process.argv.slice(titleIndex + 1)[0];
  const isVariant = newPath.includes('variants');

  // This one is only used for variants
  const skipMarkup =
    process.argv.slice(skipMarkupIndex + 1)[0] === 'true' ? true : false;

  basePath.push(newPath);

  if (name !== newPath) {
    basePath.push(name);
  }

  // Create the directory if it doesn't already exist
  if (!fs.existsSync(path.join(...basePath))) {
    fs.mkdirSync(path.join(...basePath), {recursive: true});
  }

  // Create markup if not skipping (variants only)
  if (isVariant && skipMarkup) {
    console.log(warning('Markup skipped for this variant'));
  } else {
    fs.writeFileSync(path.join(...[...basePath, `${name}.njk`]), '');
  }

  fs.writeFileSync(
    path.join(...[...basePath, `${name}.json`]),
    `
{ 
  "title": "${title || name}",
  "context": {
  }
}
`,
  );

  if (!isVariant) {
    fs.writeFileSync(path.join(...[...basePath, `${name}.md`]), '');
  }

  console.log(success(`${isVariant ? 'Variant' : 'Pattern'} created!`));
} else {
  console.log(error('Name (-n) and/or Path (-p) not defined'));
}
