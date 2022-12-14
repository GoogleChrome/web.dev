const accessible = require('./accessible.json');
const angular = require('./angular.json');
const devices = require('./devices.json');
const discoverable = require('./discoverable.json');
const fast = require('./fast.json');
const learnCoreWebVitals = require('./collection.json');
const media = require('./media.json');
const metrics = require('./metrics.json');
const notifications = require('./notifications.json');
const payments = require('./payments.json');
const progressiveWebApps = require('./progressive-web-apps.json');
const miniApps = require('./mini-apps.json');
const react = require('./react.json');
const reliable = require('./reliable.json');
const secure = require('./secure.json');
const animations = require('./animations.json');
const identity = require('./identity.json');
const webDevBasicsOne = require('./web-dev-basics-one.json');

module.exports = {
  accessible,
  angular,
  animations,
  devices,
  discoverable,
  fast,
  collection: learnCoreWebVitals,
  identity,
  media,
  metrics,
  notifications,
  payments,
  'progressive-web-apps': progressiveWebApps,
  react,
  reliable,
  secure,
  'mini-apps': miniApps,
  'web-dev-basics-one': webDevBasicsOne,
};
