const fast = require("../../../pages/fast/fast.11tydata.js").path;
const accessible = require("../../../pages/accessible/accessible.11tydata.js")
  .path;
const reliable = require("../../../reliable/reliable.11tydata.js").path;

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
