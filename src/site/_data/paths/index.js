const accessible = require('./accessible.js');
const angular = require('./angular.js');
const discoverable = require('./discoverable.js');
const fast = require('./fast.js');
const lighthouseAccessibility = require('./lighthouse-accessibility.js');
const lighthouseBestPractices = require('./lighthouse-best-practices.js');
const lighthousePerformance = require('./lighthouse-performance.js');
const lighthousePwa = require('./lighthouse-pwa.js');
const lighthouseSeo = require('./lighthouse-seo.js');
const metrics = require('./metrics.js');
const notifications = require('./notifications.js');
const payments = require('./payments.js');
const progressiveWebApps = require('./progressive-web-apps.js');
const react = require('./react.js');
const reliable = require('./reliable.js');
const secure = require('./secure.js');
const vitals = require('./vitals.js');

module.exports = {
  accessible,
  angular,
  discoverable,
  fast,
  'lighthouse-accessibility': lighthouseAccessibility,
  'lighthouse-best-practices': lighthouseBestPractices,
  'lighthouse-performance': lighthousePerformance,
  'lighthouse-pwa': lighthousePwa,
  'lighthouse-seo': lighthouseSeo,
  metrics,
  notifications,
  payments,
  'progressive-web-apps': progressiveWebApps,
  react,
  reliable,
  secure,
  vitals,
};
