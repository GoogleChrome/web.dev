const fast = require('./paths/fast');
const accessible = require('./paths/accessible');
const reliable = require('./paths/reliable');
const discoverable = require('./paths/discoverable');
const secure = require('./paths/secure');
const installable = require('./paths/installable');

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = {
  collections: [
    fast,
    accessible,
    reliable,
    discoverable,
    secure,
    installable,
  ],
};
