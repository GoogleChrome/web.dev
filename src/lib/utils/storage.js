/**
 * @fileoverview Wraps access to `window.localStorage`, as Firefox throws a
 * SecurityError (or it is null) when it is not available.
 */

/**
 * @return {!Object<string, string>}
 */
function getLocalStorage() {
  let cand;
  try {
    cand = window.localStorage;
  } catch (e) {
    // ignore
  }
  return cand || {};
}

/**
 * Exports a safe version of localStorage.
 *
 * @type {!Object<string, string>}
 */
export const localStorage = getLocalStorage();
