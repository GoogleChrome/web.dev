const livePaths = require("../../_filters/live-paths");
const fast = require("./fast/fast.11tydata.js").path;
const accessible = require("./accessible/accessible.11tydata.js").path;
const reliable = require("./reliable/reliable.11tydata.js").path;
const discoverable = require("./discoverable/discoverable.11tydata.js").path;
const secure = require("./secure/secure.11tydata.js").path;
const pwa = require("./progressive-web-apps/progressive-web-apps.11tydata.js")
  .path;

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = function() {
  const paths = [fast, accessible, reliable, secure, discoverable, pwa].filter(
    livePaths,
  );

  return {
    home: {
      paths,
    },
  };
};
