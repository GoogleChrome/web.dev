# web.dev build

The build system is based around a `ContentLoader` class, which is instantiated in [`index.js`](index.js).
It executes a number of passes over the content, which are executed in-order as they match.
These glob single files, a collection of files, or even files which don't exist—before being passed to generator functions which can modify them.

The loader is configured like this:

```js
const loader = new content.ContentLoader();

// globName matches files, and generator builds, manipulates, validates
loader.register(globName, generator);

// ... are run in-order
loader.register('index.md', AddHelloMessage);
loader.register('index.md', AddGoodbyeMessage);

// ... can match glob paths
loader.register('fixed/path/in/repo/*.html', ModifyHTMLInThatDir);
loader.register('./*.md', DotSlashMatchesAllDirs);

// ... can generate files that don't exist
loader.register('_completely-virtual-file.md', GenerateFromScratch);
loader.register('test/_test-*.md', NoFilesMatch);
```

The async methods that are called are passed a single argument, a `ContentFile` instance:

```js
// modify a file by reading and adding a string
async function ModifyFile(cf) {
  let raw = await cf.read();
  raw += '\n<web-footer></web-footer>';
  return raw;
}

// generate a whole new file by returning a new string
async function GenerateGuidesSummary(cf) {
  let out = '';
  const guides = await cf.loader.contents(`paths/*/guides.yaml`)
  for (const guideYamlFile of guides) {
    const config = await guideYamlFile.config;  // .config fetches as a YAML object
    out += config.topics.join('\n');
  }
  return out;
}

// validate a file (leaving it unchanged) by returning undefined
async function testJSON(cf) {
  const contents = await cf.read();
  try {
    JSON.parse(contents);
  } catch (e) {
    cf.warn(`Unable to parse JSON`, e);  // warn will fail build
  }
}

// hide a source file from output
async function removeAll(cf) {
  return null;
}
```

## Issues

* Virtual files cannot be created in directories that do not exist (the code cannot descend into them).

