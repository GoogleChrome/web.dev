const patterns = require('../../lib/patterns');

/**
 * @fileoverview This module gets the Code Patterns from the patterns.js module
 *   and exposes them for the use in eleventy.
 *   and exposes them for the use in eleventy. The code work is done outside
 *   of _data to avoid multiple executions by eleventy (_data will get loaded
 *   twice if it is also required as a module outside of eleventy process).
 */

module.exports = {
  patterns: patterns.patterns(),
  sets: patterns.sets(),
};
