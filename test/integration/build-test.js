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
    try {
      await exec('ELEVENTY_ENV=prod npm run build');
    } catch (err) {
      assert.fail(err);
    }
    console.log('Build completed. Starting tests.');

    [
      'feed.xml',
      'index.html',
      path.join('authors', 'addyosmani', 'feed.xml'),
      path.join('tags', 'progressive-web-apps', 'feed.xml'),
      path.join('images', 'favicon.ico'),
      path.join('images', 'lockup.svg'),
      'app.css',
      'algolia.json',
      'bootstrap.js',
      'manifest.webmanifest',
      'nuke-sw.js',
      'robots.txt',
      'sitemap.xml',
      'sw.js',
    ].forEach((file) =>
      assert.ok(
        fs.existsSync(path.join(dist, file)),
        `Could not find ${file} in ${dist}`,
      ),
    );

    const contents = fs.readdirSync(dist);

    // Check that there's a Rollup-generated file with the given name that looks
    // like `[name]-[hash].js`.
    ['app', 'measure', 'newsletter', 'default'].forEach((chunked) => {
      const re = new RegExp(`^${chunked}-\\w+\\.js$`);
      assert(
        contents.find((file) => re.test(file)),
        `Could not find Rollup output: ${chunked}`,
      );
    });

    // Check that there's NOT a web.dev/LIVE partial. We confirm that partials
    // are generally created above, in the list of common checks.
    assert(
      !fs.existsSync(path.join(dist, 'live/index.json')),
      'web.dev/LIVE partial should not exist',
    );
    assert(
      fs.existsSync(path.join(dist, 'live/index.html')),
      'web.dev/LIVE page should exist',
    );
  });
});
