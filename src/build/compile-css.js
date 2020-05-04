/**
 * @fileoverview Helper to compile SASS for web.dev.
 */

const sassEngine = (function() {
  try {
    // node-sass is faster, but regularly fails to install correctly (native bindings)
    return require('node-sass');
  } catch (e) {
    // fallback to the official transpiled version
    return require('sass');
  }
})();

/**
 * @param {!Object} options
 * @return {{css: !Buffer, map: !Buffer}}
 */
module.exports = function compileCSS(options) {
  options = Object.assign(
    {
      output: '.css',
      compress: false,
      autoprefixer: false,
    },
    options,
  );

  const compiledOptions = {
    file: options.input,
    outFile: options.output,
    sourceMap: true,
    omitSourceMapUrl: true, // since we just read it from the result object
  };
  if (options.compress) {
    compiledOptions.outputStyle = 'compressed';
  }
  const compiledResult = sassEngine.renderSync(compiledOptions);

  if (!options.autoprefixer) {
    return compiledResult;
  }

  // nb. Only require() dependencies for autoprefixer when used.
  const autoprefixer = require('autoprefixer');
  const postcss = require('postcss');

  const postcssOptions = {
    from: options.output,
    to: options.output,
    map: {
      prev: JSON.parse(compiledResult.map.toString()),
      annotation: true,
    },
  };
  const postcssResult = postcss([autoprefixer]).process(
    compiledResult.css.toString(),
    postcssOptions,
  );
  postcssResult.warnings().forEach((warn) => {
    console.warn(warn.toString());
  });

  return postcssResult;
};
