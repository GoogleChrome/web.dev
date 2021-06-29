/* global __basedir */

const chalk = require('chalk');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

// Set up the chalk warning state
const warning = chalk.black.bgYellow;
const error = chalk.black.bgRed;

module.exports = {
  // Grabs all patterns that it can find at the root level then builds up a dataset,
  // rendered markup, view markup and docs. Lastly, it finds any variants and makes
  // those part of the pattern, too
  get items() {
    // @ts-ignore
    const basePath = path.join(__basedir, 'src', 'pattern-library', 'patterns');

    // Gets pattern paths, excluding hidden files/folders
    const getPatternPaths = (refPath) => {
      return fs
        .readdirSync(refPath)
        .filter((item) => !/(^|\/)\.[^/.]/g.test(item));
    };

    // Parses out the pattern name from the last segment in its path
    const getPatternName = (patternPath) => {
      const pathParts = patternPath.split('/').filter((x) => x.length);
      return pathParts[pathParts.length - 1];
    };

    const patterns = getPatternPaths(basePath);

    // For creating a result collection
    const result = [];

    // This is used for both patterns and variants to grab markup, data and docs
    const buildPattern = (patternPath, patternName) => {
      const response = {};

      if (!fs.existsSync(path.resolve(patternPath, `${patternName}.njk`))) {
        console.log(
          warning(
            `Markup file, ${patternName}.njk wasn’t found, so this pattern (${patternPath}) can’t be built up`,
          ),
        );
        return null;
      }

      response.markup = fs.readFileSync(
        path.resolve(patternPath, `${patternName}.njk`),
        'utf8',
      );

      if (fs.existsSync(path.resolve(patternPath, `${patternName}.json`))) {
        response.data = buildPatternData(
          fs.readFileSync(
            path.resolve(patternPath, `${patternName}.json`),
            'utf8',
          ),
          path.resolve(patternPath, `${patternName}.json`),
        );

        response.rendered = nunjucks.renderString(response.markup, {
          data: response.data.context || {},
        });
      }

      if (fs.existsSync(path.resolve(patternPath, `${patternName}.md`))) {
        response.docs = fs.readFileSync(
          path.resolve(patternPath, `${patternName}.md`),
          'utf8',
        );
      }

      return response;
    };

    // Take data input and attempt to parse as JSON
    const buildPatternData = (input, filePath) => {
      try {
        return JSON.parse(input);
      } catch (ex) {
        console.log(
          error(
            `Pattern data was malformed and couldn’t be parsed (${filePath})`,
          ),
        );
        return {};
      }
    };

    // Loop each patterns folder, attempt to grab all the things and return
    // back a fully formed object to use
    patterns.forEach((item) => {
      const patternRoot = path.resolve(basePath, item);
      const patternName = getPatternName(patternRoot);
      const patternResponse = buildPattern(patternRoot, patternName);
      const patternVariantsRoot = path.resolve(patternRoot, 'variants');

      // Error will have been logged in buildPattern, but this is
      // not an acceptable response.
      if (!patternResponse) {
        return;
      }

      // Urls for pattern page and preview
      patternResponse.url = `/design-system/pattern/${patternName}/`;
      patternResponse.previewUrl = `/design-system/preview/${patternName}/`;

      // If this pattern has a variants folder, run the whole
      // process on all that can be found
      if (fs.existsSync(patternVariantsRoot)) {
        const variants = getPatternPaths(patternVariantsRoot);

        patternResponse.variants = variants.map((variant) => {
          const variantRoot = path.resolve(patternVariantsRoot, variant);
          const variantName = getPatternName(variantRoot);

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
