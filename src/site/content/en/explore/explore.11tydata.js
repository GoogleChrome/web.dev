const livePaths = require('../../../_filters/live-paths');
const allPaths = require('../../../_data/paths');

// =============================================================================
//
// This is the context object for the explore page.
// It helps layout cards featured on the explore page, and their ordering.
//
// =============================================================================

module.exports = function () {
  const performance = [
    allPaths['learn-core-web-vitals'],
    allPaths['metrics'],
    allPaths['fast'],
  ];

  const build_excellent = [
    allPaths['progressive-web-apps'],
    allPaths['accessible'],
    allPaths['reliable'],
    allPaths['secure'],
    allPaths['discoverable'],
    allPaths['payments'],
    allPaths['media'],
    allPaths['devices'],
    allPaths['animations'],
    allPaths['identity'],
  ].filter(livePaths);

  const frameworks = [
    allPaths['react'],
    allPaths['angular']
  ].filter(livePaths);

  const explorations = [
    allPaths['mini-apps']
  ].filter(livePaths);

  const web_dev_basics = [allPaths['web-dev-basics-one']];

  return {
    learn: {
      performance,
      build_excellent,
      frameworks,
      explorations,
      web_dev_basics,
    },
  };
};
