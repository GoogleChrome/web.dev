const livePaths = require('../../_filters/live-paths');
const allPaths = require('../../_data/paths');

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = function() {
  const paths = [
    allPaths['fast'],
    allPaths['accessible'],
    allPaths['reliable'],
    allPaths['secure'],
    allPaths['progressive-web-apps'],
    allPaths['vitals'],
  ].filter(livePaths);

  const lang = 'en';

  return {
    lang,
    home: {
      paths,
    },
  };
};
