const {getManifest} = require('workbox-build');
const isProd = process.env.ELEVENTY_ENV === 'prod';
const crypto = require('crypto');

let recentBuild = {};

/**
 * Builds a payload of contents to be used inside the Service Worker.
 */
async function generatePayload(template) {
  const config = {
    // JS or CSS files that include hashes don't need their own revision fields.
    dontCacheBustURLsMatching: /-[0-9a-f]{8}\.(css|js)/,
    globDirectory: 'dist',
    globPatterns: [
      // We don't include jpg files, as they're used for authors and hero
      // images, which are part of articles, and not the top-level site.
      'images/**/*.{png,svg}',
      '*.js',
      '*.css',
      '**/offline/index.html',
    ],
    globIgnores: [
      // This removes large shared PNG files that are used only for articles.
      'images/{shared}/**',
    ],
  };

  const manifest = await getManifest(config);
  if (isProd && manifest.warnings.length) {
    throw new Error(`Could not generate SW manifest: ${manifest.warnings}`);
  }

  const c = crypto.createHash('sha1');
  c.update(template);

  const entries = manifest.manifestEntries.map((raw) => {
    if (raw.url.endsWith('/offline/index.html')) {
      raw.url = raw.url.replace(/\.html$/, '.json');
    }
    c.update(raw.url);
    raw.revision && c.update(raw.revision);
    return raw;
  });
  const resourcesVersion = c.digest('hex').substr(0, 12);
  const builtAt = +new Date();

  recentBuild = {
    resourcesVersion,
    builtAt,
  };

  return {
    template,
    entries,
    resourcesVersion,
    builtAt,
  };
}

const serviceWorkerPayload = async (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('/sw-payload')) {
    return content;
  }

  const out = await generatePayload(content);
  return JSON.stringify(out);
};

/**
 * This allows our peer partials transform to read the version to include with all partials.
 *
 * @return {{resourcesVersion: string, builtAt: number}}
 */
const getRecentBuild = () => recentBuild;

module.exports = {serviceWorkerPayload, getRecentBuild};
