const livePaths = require("../../_filters/live-paths");
const fast = require("../en/fast/fast.11tydata.js").path;
const accessible = require("../en/accessible/accessible.11tydata.js").path;
const reliable = require("../en/reliable/reliable.11tydata.js").path;
const discoverable = require("../en/discoverable/discoverable.11tydata.js")
  .path;
const secure = require("../en/secure/secure.11tydata.js").path;
const installable = require("../en/installable/installable.11tydata.js").path;

// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = function() {
  const paths = [
    fast,
    accessible,
    reliable,
    secure,
    discoverable,
    installable,
  ].filter(livePaths);

  const lang = "en";

  return {
    lang,
    home: {
      paths,
    },
  };
};
