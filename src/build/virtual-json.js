/**
 * @fileoverview Helper that converts JSON into ESM that exports that JSON.
 *
 * This does not use a standard Rollup plugin as these files aren't coming from
 * disk and don't have a "real" name.
 */

const validJSName = /^[\w_$][\w\d_$]*$/;

/**
 * @param {any} object to serialize
 * @return {string}
 */
function createVirtualExport(object) {
  const parts = [`export default ${JSON.stringify(object)};`];

  // If this is an object, use its keys as top-level exports, where the keys are valid JS variable
  // names (e.g. "foo" will be exported but "foo-bar" will not).
  if (object && typeof object === 'object' && !Array.isArray(object)) {
    for (const key in object) {
      if (validJSName.test(key) && key !== 'default') {
        // nb. This doesn't check for all JS keywords. Don't try to export "class".
        // nb. We use var for compatibility with old browsers (as our basic bundle is run there).
        parts.push(`export var ${key} = ${JSON.stringify(object[key])};`);
      }
    }
  }

  return parts.join('\n');
}

/**
 * @param {!Object<string, any>} all
 * @return {!Object<string, string>}
 */
module.exports = (all) => {
  const out = /** @type {!Object<string, string>} } */ ({});
  Object.keys(all).forEach((key) => {
    out[key] = createVirtualExport(all[key]);
  });
  return out;
};
