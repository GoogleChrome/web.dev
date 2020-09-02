const livePaths = require('../../_filters/live-paths');
const allPaths = require('../../_data/paths');
const lang = require('./lang');

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = function () {
  const paths = [
    allPaths['vitals'],
    allPaths['progressive-web-apps'],
    allPaths['accessible'],
    allPaths['fast'],
    allPaths['reliable'],
    allPaths['secure'],
  ].filter(livePaths);

  return {
    lang: lang.lang,
    locale: lang.locale,
    translated: 'none',
    home: {
      paths,
    },
    eleventyComputed: {
      permalink: (data) => {
        if (data.permalink) {
          return data.permalink.replace(
            /^\/{{lang}}/,
            '/localized-files/{{lang}}',
          );
        }

        return data.page.inputPath
          .replace(/index.(md|njk)$/, '')
          .replace(/^.\/src\/site\/content/, '');
      },
    },
  };
};
