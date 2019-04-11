const fast = require('./paths/fast');
const accessible = require('./paths/accessible');
const reliable = require('./paths/reliable');
const discoverable = require('./paths/discoverable');
const secure = require('./paths/secure');
const installable = require('./paths/installable');

const performanceAudits = require('./paths/performanceAudits');

// =============================================================================
// LEARN OVERVIEW
//
// This is the context object for the learn page.
// It helps layout cards featured on the learn page, and their ordering.
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
    performanceAudits,
  ],
};
