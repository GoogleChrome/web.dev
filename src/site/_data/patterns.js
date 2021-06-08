/* global __basedir */

const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Grabs all patters that it can find at the root level then builds up a dataset,
  // rendered markup, view markup and docs. Lastly, it finds any variants and makes
  // those part of the pattern, too
  get items() {
    const basePath = path.resolve(__basedir, 'src/pattern-library/patterns');

    // Grabs each folder inside patterns, excluding hidden files/folders
    const patterns = fs
      .readdirSync(basePath)
      .filter((item) => !/(^|\/)\.[^/.]/g.test(item));

    // For creating a result collection
    const result = [];

    // This is used for both patterns and variants to grab markup, data and docs
    const buildPattern = (patternPath, patternName) => {
      const response = {};

      if (!fs.existsSync(path.resolve(patternPath, `${patternName}.njk`))) {
        return null;
      }

      response['markup'] = fs.readFileSync(
        path.resolve(patternPath, `${patternName}.njk`),
        'utf8',
      );

      if (fs.existsSync(path.resolve(patternPath, `${patternName}.json`))) {
        response['data'] = JSON.parse(
          fs.readFileSync(
            path.resolve(patternPath, `${patternName}.json`),
            'utf8',
          ),
        );

        response['rendered'] = nunjucks.renderString(response.markup, {
          data: Object.prototype.hasOwnProperty.call(response.data, 'context')
            ? response.data.context
            : {},
        });
      }

      if (fs.existsSync(path.resolve(patternPath, `${patternName}.md`))) {
        response['docs'] = fs.readFileSync(
          path.resolve(patternPath, `${patternName}.md`),
          'utf8',
        );
      }

      return response;
    };

    // Loop each patterns folder, attempt to grab all the things and return
    // back a fully formed object to use
    patterns.forEach((item) => {
      const patternRoot = path.resolve(basePath, item);
      const patternRootParts = patternRoot.split('/').filter((x) => x.length);
      const patternName = patternRootParts[patternRootParts.length - 1];
      const patternResponse = buildPattern(patternRoot, patternName);
      const patternVariantsRoot = path.resolve(patternRoot, 'variants');

      // Urls for pattern page and preview
      patternResponse['url'] = `/design-system/pattern/${patternName}/`;
      patternResponse['previewUrl'] = `/design-system/preview/${patternName}/`;

      // If this pattern has a variants folder, run the whole
      // process on all that can be found
      if (fs.existsSync(patternVariantsRoot)) {
        const variants = fs
          .readdirSync(patternVariantsRoot)
          .filter((item) => !/(^|\/)\.[^/.]/g.test(item));

        patternResponse['variants'] = variants.map((variant) => {
          const variantRoot = path.resolve(patternVariantsRoot, variant);
          const variantRootParts = variantRoot
            .split('/')
            .filter((x) => x.length);
          const variantName = variantRootParts[variantRootParts.length - 1];

          return {
            ...{
              previewUrl: `/design-system/preview/${patternName}/${variantName}/`,
            },
            ...buildPattern(variantRoot, variantName),
          };
        });
      }

      result.push(patternResponse);
    });

    return result;
  },

  // Returns a flat array of all patterns and variants
  get previews() {
    const response = [];

    this.items.forEach((item) => {
      // Slice only what's needed from root pattern
      response.push({
        previewUrl: item.previewUrl,
        data: {
          title: item.data.title,
        },
        rendered: item.rendered,
      });

      if (item.variants) {
        item.variants.forEach((variant) => {
          response.push(variant);
        });
      }
    });

    return response;
  },
};
