/* global __designSystemPaths */

// Attempts to find passed path in generated design system
// compatible paths, which are a Set
module.exports = (path) => __designSystemPaths.has(path);
