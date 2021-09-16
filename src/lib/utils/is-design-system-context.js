/* global __designSystemPaths */

// Attempts to find passed path in generated design system compatible paths
module.exports = (path) => __designSystemPaths.includes(path);
