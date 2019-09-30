/**
 * Decides on the entrypoint for the given site URL.
 *
 * @param {string} url following "/", e.g. "measure" or "learn"
 * @return {string}
 */
export default function entrypointForRoute(url) {
  if (pathname.match(/^measure($|\/)/)) {
    return "measure.js";
  }
  return "default.js";
}
