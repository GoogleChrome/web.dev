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
  const paths = [
    allPaths['progressive-web-apps'],
    allPaths['accessible'],
    allPaths['reliable'],
    allPaths['secure'],
    allPaths['discoverable'],
    allPaths['payments'],
    allPaths['media'],
    allPaths['devices'],
    allPaths['animations'],
  ].filter(livePaths);

  const performance = [
    allPaths['learn-web-vitals'],
    allPaths['metrics'],
    allPaths['fast'],
  ];

  const frameworks = [allPaths['react'], allPaths['angular']].filter(livePaths);

  const audits = [
    allPaths['lighthouse-performance'],
    allPaths['lighthouse-pwa'],
    allPaths['lighthouse-best-practices'],
    allPaths['lighthouse-accessibility'],
    allPaths['lighthouse-seo'],
  ].filter(livePaths);

  const explorations = [allPaths['mini-apps']].filter(livePaths);

  return {
    learn: {
      paths,
      performance,
      frameworks,
      audits,
      explorations,
    },
  };
};
