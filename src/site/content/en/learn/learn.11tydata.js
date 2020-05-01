const livePaths = require('../../../_filters/live-paths');

const fast = require('../fast/fast.11tydata.js').path;
const accessible = require('../accessible/accessible.11tydata.js').path;
const reliable = require('../reliable/reliable.11tydata.js').path;
const discoverable = require('../discoverable/discoverable.11tydata.js').path;
const secure = require('../secure/secure.11tydata.js').path;
const pwa = require('../progressive-web-apps/progressive-web-apps.11tydata.js')
  .path;
const vitals = require('../vitals/vitals.11tydata.js').path;

const react = require('../react/react.11tydata.js').path;
const angular = require('../angular/angular.11tydata.js').path;

const lighthousePerformance = require('../lighthouse-performance/lighthouse-performance.11tydata.js')
  .path;
const lighthousePwa = require('../lighthouse-pwa/lighthouse-pwa.11tydata.js')
  .path;
const lighthouseBestPractices = require('../lighthouse-best-practices/lighthouse-best-practices.11tydata.js')
  .path;
const lighthouseAccessibility = require('../lighthouse-accessibility/lighthouse-accessibility.11tydata.js')
  .path;
const lighthouseSeo = require('../lighthouse-seo/lighthouse-seo.11tydata.js')
  .path;

// =============================================================================
// LEARN OVERVIEW
//
// This is the context object for the learn page.
// It helps layout cards featured on the learn page, and their ordering.
//
// =============================================================================

module.exports = function() {
  const paths = [
    fast,
    accessible,
    reliable,
    secure,
    discoverable,
    pwa,
    vitals,
  ].filter(livePaths);

  const frameworks = [react, angular].filter(livePaths);

  const audits = [
    lighthousePerformance,
    lighthousePwa,
    lighthouseBestPractices,
    lighthouseAccessibility,
    lighthouseSeo,
  ].filter(livePaths);

  return {
    learn: {
      paths,
      frameworks,
      audits,
    },
  };
};
