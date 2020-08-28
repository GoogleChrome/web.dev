const accessible = require('./accessible.json');
const angular = require('./angular.json');
const discoverable = require('./discoverable.json');
const fast = require('./fast.json');
const lighthouseAccessibility = require('./lighthouse-accessibility.json');
const lighthouseBestPractices = require('./lighthouse-best-practices.json');
const lighthousePerformance = require('./lighthouse-performance.json');
const lighthousePwa = require('./lighthouse-pwa.json');
const lighthouseSeo = require('./lighthouse-seo.json');
const media = require('./media.json');
const metrics = require('./metrics.json');
const notifications = require('./notifications.json');
const payments = require('./payments.json');
const progressiveWebApps = require('./progressive-web-apps.json');
const react = require('./react.json');
const reliable = require('./reliable.json');
const secure = require('./secure.json');
const vitals = require('./vitals.json');

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
  media,
};
