const assert = require('assert');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '..', '..', 'dist');

describe('Build test', function () {
  it('generates the expected files', async function () {
    // Disable the timeout as it'll take build a little while to finish.
    // eslint-disable-next-line
    this.timeout(0);

    console.log('Running npm run build...');
    if (fs.existsSync('./dist')) {
      console.log(
        '`dist` folder already exists, build completed. Starting tests.',
      );
    } else {
      try {
        await exec('ELEVENTY_ENV=prod npm run build');
      } catch (err) {
        assert.fail(err);
      }
      console.log('Build completed. Starting tests.');
    }

    [
      'feed.xml',
      'index.html',
      path.join('authors', 'addyosmani', 'feed.xml'),
      path.join('tags', 'progressive-web-apps', 'feed.xml'),
      path.join('css', 'main.css'),
      'pages.json',
      'manifest.webmanifest',
      'sw.js',
      'robots.txt',
      'sitemap.xml',
    ].forEach((file) =>
      assert.ok(
        fs.existsSync(path.join(dist, file)),
        `Could not find ${file} in ${dist}`,
      ),
    );

    const contents = fs.readdirSync(path.join(dist, 'js'));
    // Check that there's a Rollup-generated file for all of our entrypoints.
    [
      'app.js',
      'measure.js',
      'newsletter.js',
      'default.js',
      'content.js',
    ].forEach((file) => {
      assert(
        contents.find((item) => item === file),
        `Could not find Rollup output: ${file}`,
      );
    });
  });
});
