const fast = require('../../../../../_data/paths/fast.json');
const accessible = require('../../../../../_data/paths/accessible.json');
const reliable = require('../../../../../_data/paths/reliable.json');

// =============================================================================
// LEARN OVERVIEW
//
// This is the context object for the learn page.
// It helps layout cards featured on the learn page, and their ordering.
//
// =============================================================================

module.exports = {
  paths: [fast, accessible, reliable],
};
