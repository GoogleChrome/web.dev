const fast = require(
  '../../../en/fast/fast.11tydata.js'
).path;
const accessible = require(
  '../../../en/accessible/accessible.11tydata.js'
).path;
const reliable = require(
  '../../../en/reliable/reliable.11tydata.js'
).path;

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
  ],
};
