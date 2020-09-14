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
  ].filter(livePaths);

  const performance = [
    allPaths['vitals'],
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

  return {
    learn: {
      paths,
      performance,
      frameworks,
      audits,
    },
  };
};
