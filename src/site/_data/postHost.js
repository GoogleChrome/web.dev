const learn = require('../content/en/learn/learn.11tydata.js');

// =============================================================================
// POST HOST
//
// Returns a dictionary that reverse maps each guide (by ID) to its location
// inside a Path > Topic, based on the config inside `_data/paths/*.js`. Used
// to generate Lighthouse mapping data.
//
// =============================================================================

module.exports = function() {
  const out = {};

  const paths = learn.paths;
  paths.forEach((path) => {
    path.topics.forEach((topic) => {
      (topic.pathItems || []).forEach((id) => {
        if (id in out) {
          // TODO(samthor): Warn that a guide is in multiple locations?
        }
        out[id] = {
          path: path.title,
          topic: topic.title,
        };
      });
    });
  });

  return out;
};
