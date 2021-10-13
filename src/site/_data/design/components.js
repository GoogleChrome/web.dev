/* global __basedir */

const chalk = require('chalk');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

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
  {autoescape: false},
);

nunjucksEnv.addFilter('md', md);

// For storing processed items for speedier builds
let processedItems = [];

module.exports = {
  // Grabs all components that it can find at the root level then builds up a dataset,
  // rendered markup, view markup and docs. Lastly, it finds any variants and makes
  // those part of the component, too
  get items() {
    // @ts-ignore

    // If the items have already been processed, it's an immediate return
    if (processedItems.length) {
      return processedItems;
    }

    const basePath = path.join(__basedir, 'src', 'component-library');

    // Gets component paths, excluding hidden files/folders
    const getComponentPaths = (refPath) => {
      return fs
        .readdirSync(refPath)
        .filter((item) => !/(^|\/)\.[^/.]/g.test(item)) // Hidden
        .filter((item) => !/[^\\]*\.(\w+)$/.test(item)); // detect file
    };

    // Parses out the component name from the last segment in its path
    const getComponentName = (componentPath) => {
      const pathParts = componentPath.split('/').filter((x) => x.length);
      return pathParts[pathParts.length - 1];
    };

    const components = getComponentPaths(basePath);

    // For creating a result collection
    const result = [];

    // This is used for both components and variants to grab markup, data and docs
    const buildComponent = (
      componentPath,
      componentName,
      parentPath = null,
      parentName = null,
      contextData = null,
    ) => {
      const response = {};

      // Attempt to load markup from the pass componentPath and componentName first,
      // but if that can’t be found, attempt to load from the parent instead, if
      // its details have been passed in
      if (fs.existsSync(path.resolve(componentPath, `${componentName}.njk`))) {
        response.markup = fs.readFileSync(
          path.resolve(componentPath, `${componentName}.njk`),
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
            `Markup file, ${componentName}.njk wasn’t found, so this component (${componentPath}) can’t be built up`,
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
        fs.existsSync(path.resolve(componentPath, `${componentName}.json`))
      ) {
        response.data = buildComponentData(
          fs.readFileSync(
            path.resolve(componentPath, `${componentName}.json`),
            'utf8',
          ),
          path.resolve(componentPath, `${componentName}.json`),
        );
      }

      // Render the component with nunjucks and then run it through
      // prettier so format it correctly to make copy/paste easier
      response.rendered = prettier
        .format(
          nunjucksEnv.renderString(response.markup, {
            data: response.data.context || {},
          }),
          {
            useTabs: false,
            tabWidth: 2,
            parser: 'html',
          },
        )
        .replace(/^\s*\n/gm, ''); // Gets rid of blank lines (https://stackoverflow.com/q/16369642)

      if (fs.existsSync(path.resolve(componentPath, `${componentName}.md`))) {
        response.docs = fs.readFileSync(
          path.resolve(componentPath, `${componentName}.md`),
          'utf8',
        );
      }

      return response;
    };

    // Take data input and attempt to parse as JSON
    const buildComponentData = (input, filePath) => {
      try {
        return JSON.parse(input);
      } catch (ex) {
        console.log(
          error(
            `Component data was malformed and couldn’t be parsed (${filePath})`,
          ),
        );
        return {};
      }
    };

    // Loop each components folder, attempt to grab all the things and return
    // back a fully formed object to use
    components.forEach((item) => {
      const componentRoot = path.resolve(basePath, item);
      const componentName = getComponentName(componentRoot);
      const componentResponse = buildComponent(componentRoot, componentName);
      const componentVariantsRoot = path.resolve(componentRoot, 'variants');
      const componentVariantsData = componentResponse.data.variants || [];

      // Error will have been logged in buildComponent, but this is
      // not an acceptable response.
      if (!componentResponse) {
        return;
      }

      // Urls for component page and preview
      componentResponse.handle = componentName;
      componentResponse.url = `/design-system/component/${componentName}/`;
      componentResponse.previewUrl = `/design-system/preview/${componentName}/`;

      // An empty container for variants for if one or the other methods of loading
      // them results in nothing
      componentResponse.variants = [];

      // If this component has a variants folder
      // run the whole process on all that can be found
      if (fs.existsSync(componentVariantsRoot)) {
        const variants = getComponentPaths(componentVariantsRoot);

        componentResponse.variants = variants.map((variant) => {
          const variantRoot = path.resolve(componentVariantsRoot, variant);
          const variantName = getComponentName(variantRoot);

          return {
            ...{
              name: variantName,
              handle: componentName + '-' + variantName,
              previewUrl: `/design-system/preview/${componentName}/${variantName}/`,
            },
            ...buildComponent(
              variantRoot,
              variantName,
              componentRoot,
              componentName,
            ),
          };
        });
      }

      // If variants are defined in the root component's config,
      // we need to render them too, using the root component's markup
      if (componentVariantsData.length) {
        const dataVariantItems = [];
        componentVariantsData.forEach((variant) => {
          dataVariantItems.push({
            ...{
              name: variant.name,
              handle: componentName + '-' + variant.name,
              previewUrl: `/design-system/preview/${componentName}/${variant.name}/`,
            },
            ...buildComponent(componentRoot, componentName, null, null, {
              title: variant.title || variant.name,
              context: {...componentResponse.data.context, ...variant.context}, // Merge existing context with variant context so we don't have to repeat ourselves a lot
            }),
          });
        });

        // Now with the data variants built, we need to loop,
        // check that a file-based one wasn't already made,
        // then add it to the collection
        dataVariantItems.forEach((variantItem) => {
          const existingComponent = componentResponse.variants.find(
            (x) => x.name === variantItem.name,
          );

          // Variant data files take priority, so if a rendered component exists, bail on this iteration
          if (existingComponent) {
            console.log(
              warning(
                `The variant, ${variantItem.name} was already processed with a data file, which takes priority over variants defined in the root component’ (${componentName}) data file`,
              ),
            );
            return;
          }

          componentResponse.variants.push(variantItem);
        });
      }

      // Lastly, sort variants by name if component hasn't
      // specifically defined source order sorting
      if (componentResponse.data.sort !== 'source') {
        if (componentResponse.variants) {
          componentResponse.variants = componentResponse.variants.sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        }
      }

      result.push(componentResponse);
    });

    processedItems = result;
    return result;
  },

  // Returns a flat array of all components and variants
  get previews() {
    const response = [];

    this.items.forEach((item) => {
      // Slice only what's needed from root component
      response.push({
        previewUrl: item.previewUrl,
        data: item.data,
        rendered: item.rendered,
        markup: item.markup,
        handle: item.handle,
      });

      if (item.variants) {
        item.variants.forEach((variant) => {
          response.push(variant);
        });
      }
    });

    return response;
  },

  // Takes a handle, tries to match that with a component or variant then
  // applies passed data if available
  render(handle, data = null) {
    const item = this.previews.find((item) => item.handle === handle);

    if (!item) {
      console.log(error(`Component, "${handle}" couldn't be found`));
      return '';
    }

    // Passed data overwrites any context data.
    const renderData = {...item.data.context, ...data};
    return nunjucksEnv.renderString(item.markup, {data: renderData});
  },
};
