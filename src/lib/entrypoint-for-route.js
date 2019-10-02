import "./polyfill/import";

/**
 * Imports the entrypoint for the given site URL.
 *
 * @param {string} url following "/", e.g. "measure" or "learn"
 * @return {!Promise<void>}
 */
export default function entrypointForRoute(url) {
  let p;

  if (url.match(/^measure($|\/)/)) {
    p = import("./pages/measure.js");
  } else {
    p = import("./pages/default.js");
  }
  return p;
}
