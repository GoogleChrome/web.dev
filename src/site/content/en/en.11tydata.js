const fast = require('./fast/fast.11tydata.js');
const accessible = require('./accessible/accessible.11tydata.js');
const reliable = require('./reliable/reliable.11tydata.js');
const discoverable = require('./discoverable/discoverable.11tydata.js');
const secure = require('./secure/secure.11tydata.js');
const installable = require('./installable/installable.11tydata.js');

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = {
  paths: [
    fast,
    accessible,
    reliable,
    discoverable,
    secure,
    installable,
  ],
};
