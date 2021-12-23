const livePaths = require('../../../_filters/live-paths');
const allPaths = require('../../../_data/paths');

// =============================================================================
// LEARN OVERVIEW
//
// This is the context object for the learn page.
// It helps layout cards featured on the learn page, and their ordering.
//
// =============================================================================

module.exports = function () {
  const performance = [
    allPaths['learn-web-vitals'],
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

  const frameworks = [allPaths['react'], allPaths['angular']].filter(livePaths);

  const lighthouse = [
    allPaths['lighthouse-performance'],
    allPaths['lighthouse-pwa'],
    allPaths['lighthouse-best-practices'],
    allPaths['lighthouse-accessibility'],
    allPaths['lighthouse-seo'],
  ].filter(livePaths);

  const explorations = [allPaths['mini-apps']].filter(livePaths);

  return {
    learn: {
      performance,
      build_excellent,
      frameworks,
      lighthouse,
      explorations,
    },
  };
};
