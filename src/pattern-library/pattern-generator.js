const fs = require('fs');
const path = require('path');

const pathIndex = process.argv.indexOf('-p');
const nameIndex = process.argv.indexOf('-n');
const titleIndex = process.argv.indexOf('-t');
const basePath = [process.cwd(), 'src', 'pattern-library', 'patterns'];

if (pathIndex > 0 && nameIndex > 0) {
  const newPath = process.argv.slice(pathIndex + 1)[0];
  const name = process.argv.slice(nameIndex + 1)[0];
  const title = process.argv.slice(titleIndex + 1)[0];

  basePath.push(newPath);

  if (name !== newPath) {
    basePath.push(name);
  }

  // Create the directory if it doesn't already exist
  if (!fs.existsSync(path.join(...basePath))) {
    fs.mkdirSync(path.join(...basePath), {recursive: true});
  }

  fs.writeFileSync(path.join(...[...basePath, `${name}.njk`]), '');
  fs.writeFileSync(
    path.join(...[...basePath, `${name}.json`]),
    `{ "title": "${title || name}" }`,
  );

  if (!newPath.includes('variants')) {
    fs.writeFileSync(path.join(...[...basePath, `${name}.md`]), '');
  }

  console.log('Pattern created!');
} else {
  console.error('Name (-n) and/or Path (-p) not defined');
}
