
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
    /* eslint-disable-next-line */
    p = import("./pages/measure.js");
  } else {
    /* eslint-disable-next-line */
    p = import("./pages/default.js");
  }
  console.info('loading entrypoint for', url);
  return p;
}
