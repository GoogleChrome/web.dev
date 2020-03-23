
/**
 * @fileoverview Helper that converts JSON into ESM that exports that JSON.
 *
 * This does not use a standard Rollup plugin as these files aren't coming from
 * disk and don't have a "real" name.
 */

function createVirtualExport(object) {
  const parts = [`export default ${JSON.stringify(object)};`];

  if (object && typeof object === 'object' && !Array.isArray(object)) {
    for (const key in object) {
      if (key.match(/^[\w_$][\w\d_$]*$/)) {
        parts.push(`export const ${key} = ${JSON.stringify(object[key])};`);
      }
    }
  }

  return parts.join('\n');
}

module.exports = (all) => {
  const out = {};
  for (const key in all) {
    out[key] = createVirtualExport(all[key]);
  }
  return out;
};