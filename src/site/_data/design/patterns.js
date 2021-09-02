/* global __basedir */

const chalk = require('chalk');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

// Pull in filters
const md = require('../../_filters/md');

// Set up the chalk warning and error state
// @ts-ignore
const warning = chalk.black.bgYellow;
// @ts-ignore
const error = chalk.black.bgRed;

// Set up custom nunjucks environment and add custom parts
const nunjucksEnv = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(
    path.join(__basedir, 'src', 'site', '_includes'),
  ),
);

nunjucksEnv.addFilter('md', md);

// For storing processed items for speedier builds
let processedItems = [];

module.exports = {
  // Grabs all patterns that it can find at the root level then builds up a dataset,
  // rendered markup, view markup and docs. Lastly, it finds any variants and makes
  // those part of the pattern, too
  get items() {
    // @ts-ignore

    // If the items have already been processed, it's an immediate return
    if (processedItems.length) {
      return processedItems;
    }

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
    const buildPattern = (
      patternPath,
      patternName,
      parentPath = null,
      parentName = null,
      contextData = null,
    ) => {
      const response = {};

      // Attempt to load markup from the pass patternPath and patternName first,
      // but if that can’t be found, attempt to load from the parent instead, if
      // its details have been passed in
      if (fs.existsSync(path.resolve(patternPath, `${patternName}.njk`))) {
        response.markup = fs.readFileSync(
          path.resolve(patternPath, `${patternName}.njk`),
          'utf8',
        );
      } else {
        if (parentPath !== null && parentName !== null) {
          if (fs.existsSync(path.resolve(parentPath, `${parentName}.njk`))) {
            response.markup = fs.readFileSync(
              path.resolve(parentPath, `${parentName}.njk`),
              'utf8',
            );
          }
        }
      }

      // All markup avenues exhausted so time to bail out
      if (!response.markup.length) {
        console.log(
          warning(
            `Markup file, ${patternName}.njk wasn’t found, so this pattern (${patternPath}) can’t be built up`,
          ),
        );
        return null;
      }

      // If specific context data has been passed, we prioritise that
      if (contextData) {
        response.data = contextData.context
          ? contextData
          : {context: contextData};
      }
      // If not, we look for a data file
      else if (
        fs.existsSync(path.resolve(patternPath, `${patternName}.json`))
      ) {
        response.data = buildPatternData(
          fs.readFileSync(
            path.resolve(patternPath, `${patternName}.json`),
            'utf8',
          ),
          path.resolve(patternPath, `${patternName}.json`),
        );
      }

      response.rendered = nunjucksEnv.renderString(response.markup, {
        data: response.data.context || {},
      });

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
      const patterVariantsData = patternResponse.data.variants || [];

      // Error will have been logged in buildPattern, but this is
      // not an acceptable response.
      if (!patternResponse) {
        return;
      }

      // Urls for pattern page and preview
      patternResponse.url = `/design-system/pattern/${patternName}/`;
      patternResponse.previewUrl = `/design-system/preview/${patternName}/`;

      // An empty container for variants for if one or the other methods of loading
      // them results in nothing
      patternResponse.variants = [];

      // If this pattern has a variants folder
      // run the whole process on all that can be found
      if (fs.existsSync(patternVariantsRoot)) {
        const variants = getPatternPaths(patternVariantsRoot);

        patternResponse.variants = variants.map((variant) => {
          const variantRoot = path.resolve(patternVariantsRoot, variant);
          const variantName = getPatternName(variantRoot);

          return {
            ...{
              name: variantName,
              previewUrl: `/design-system/preview/${patternName}/${variantName}/`,
            },
            ...buildPattern(variantRoot, variantName, patternRoot, patternName),
          };
        });
      }

      // If variants are defined in the root pattern's config,
      // we need to render them too, using the root pattern's markup
      if (patterVariantsData.length) {
        const dataVariantItems = [];

        patterVariantsData.forEach((variant) => {
          dataVariantItems.push({
            ...{
              name: variant.name,
              previewUrl: `/design-system/preview/${patternName}/${variant.name}/`,
            },
            ...buildPattern(patternRoot, patternName, null, null, {
              title: variant.title || variant.name,
              context: {...patternResponse.data.context, ...variant.context}, // Merge existing context with variant context so we don't have to repeat ourselves a lot
            }),
          });
        });

        // Now with the data variants built, we need to loop,
        // check that a file-based one wasn't already made,
        // then add it to the collection
        dataVariantItems.forEach((variantItem) => {
          const existingPattern = patternResponse.variants.find(
            (x) => x.name === variantItem.name,
          );

          // Variant data files take priority, so if a rendered pattern exists, bail on this iteration
          if (existingPattern) {
            console.log(
              warning(
                `The variant, ${variantItem.name} was already processed with a data file, which takes priority over variants defined in the root pattern’ (${patternName}) data file`,
              ),
            );
            return;
          }

          patternResponse.variants.push(variantItem);
        });
      }

      // Lastly, sort variants by name if pattern hasn't
      // specifically defined source order sorting
      if (patternResponse.data.sort !== 'source') {
        if (patternResponse.variants) {
          patternResponse.variants = patternResponse.variants.sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        }
      }

      result.push(patternResponse);
    });

    processedItems = result;
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
