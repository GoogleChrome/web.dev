/**
 * @fileoverview Helper that converts JSON into ESM that exports that JSON.
 *
 * This does not use a standard Rollup plugin as these files aren't coming from
 * disk and don't have a "real" name.
 */

function createVirtualExport(object) {
  const parts = [`export default ${JSON.stringify(object)};`];

  if (object && typeof object === "object" && !Array.isArray(object)) {
    for (const key in object) {
      // If this is a valid JS variable name, include as a named export.
      if (key.match(/^[\w_$][\w\d_$]*$/)) {
        // nb. We use var for compatibility with old browsers.
        parts.push(`export var ${key} = ${JSON.stringify(object[key])};`);
      }
    }
  }

  return parts.join("\n");
}

module.exports = (all) => {
  const out = {};
  Object.keys(all).forEach((key) => {
    out[key] = createVirtualExport(all[key]);
  });
  return out;
};
