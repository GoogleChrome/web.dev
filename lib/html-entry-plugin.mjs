import fs from 'fs';
import { resolve, join } from 'path';

import { minify as minifyHTML } from 'html-minifier';
import chokidar from 'chokidar';

function processHTML(rollup, htmlPath, assetCache) {
  let html = fs.readFileSync(htmlPath, { encoding: 'utf8' });

  // Find assets
  html = html.replace(
    /confboxAsset\((['"]?)(.*?)\1\)/g,
    (fullMatch, p1, path) => {
      if (!path.startsWith('/')) {
        throw new TypeError(
          `confboxAsset must be absolute (start with /): ${path}`,
        );
      }
      const filePath = join(...('.build-tmp' + path).split('/'));
      const targetPath = path.slice(1);

      if (!assetCache.has(targetPath)) {
        const source = fs.readFileSync(filePath);
        const id = rollup.emitAsset(targetPath, source);
        assetCache.set(targetPath, id);
      }

      // This will be replaced with the real URL in generateBundle.
      return `confboxAsset#${assetCache.get(targetPath)}#`;
    },
  );

  // Find scripts
  html = html.replace(
    /confboxScript\((['"]?)(.*?)\1\)/g,
    (fullMatch, p1, path) => {
      if (!path.startsWith('/')) {
        throw new TypeError(
          `confboxScript must be absolute (start with /): ${path}`,
        );
      }
      const filePath = join(...('.build-tmp' + path).split('/'));
      // Remove leading slash and extension (else rollup adds another extension)
      const targetPath = path.slice(1).replace(/\.[^\.]+$/, '');
      const id = rollup.emitChunk(filePath, { name: targetPath });

      // This will be replaced with the real URL in generateBundle.
      return `confboxScript#${id}#`;
    },
  );

  return html;
}

const defaultOptions = {
  minifyOptions: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  },
};

export default function htmlEntryPlugin(userOptions = {}) {
  const htmlTargetPaths = new Map();
  const assetCache = new Map();
  const options = { ...defaultOptions, ...userOptions };

  return {
    name: 'html-entry-plugin',
    async buildStart(options) {
      // Prevent rollup failing if it doesn't find any JS.
      this.emitChunk('./lib/empty.js');

      const handleChange = htmlPath => {
        const html = processHTML(this, htmlPath, assetCache);
        const targetPath = htmlPath.replace(/^[^/]+\//, '');
        const id = this.emitAsset(targetPath, html);
        htmlTargetPaths.set(id, targetPath);
      };

      await new Promise(resolve => {
        const watcher = chokidar.watch('.build-tmp/**/*.html');
        watcher.on('add', handleChange);
        watcher.on('change', handleChange);
        watcher.on('ready', () => {
          if (!options.watch) watcher.close();
          resolve();
        });
      });
    },
    generateBundle(_, bundle) {
      // Remove empty.js
      const emptyPath = resolve(__dirname, 'lib', 'empty.js');
      for (const entry of Object.values(bundle)) {
        if (entry.facadeModuleId === emptyPath) {
          delete bundle[entry.fileName];
        }
      }

      for (const [id, targetPath] of htmlTargetPaths) {
        // Move HTML files out of 'assets' and remove hashing.
        const fileName = this.getAssetFileName(id);
        const entry = bundle[fileName];
        delete bundle[fileName];
        entry.fileName = targetPath;
        bundle[targetPath] = entry;
        // Set final URLs for assets
        entry.source = entry.source.replace(
          /confboxAsset#([^#]+)#/g,
          (_, id) => '/' + this.getAssetFileName(id),
        );
        // Set final URLs for scripts
        entry.source = entry.source.replace(
          /confboxScript#([^#]+)#/g,
          (_, id) => '/' + this.getChunkFileName(id),
        );
        // Minify HTML
        if (options.minifyOptions) {
          // entry.source = minifyHTML(entry.source, options.minifyOptions);
        }
      }
    },
  };
}