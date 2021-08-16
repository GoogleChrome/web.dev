const patterns = require('../../lib/patterns');

/**
 * @fileoverview This module gets the Code Patterns from the patterns.js module
 *   and exposes them for the use in eleventy.
 */

module.exports = {
  patterns: patterns.patterns(),
  sets: patterns.sets(),
};
