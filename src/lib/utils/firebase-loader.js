/**
 * @fileoverview Dynamic loading code for Firebase and libraries.
 */

/**
 * @type {Object.<string, Promise>}
 */
const libs = {};

const firebasePrefix = '//www.gstatic.com/firebasejs/6.6.1';

/**
 * Loads the specific Firebase library (or returns the previous cached load).
 *
 * @param {string} library to load
 * @return {!Promise<void>} for library
 */
function internalLoad(library) {
  if (library in libs) {
    return libs[library];
  }

  const p = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `${firebasePrefix}/firebase-${library}.js`;
    s.async = false; // prevent misordered execution

    s.onerror = reject;
    s.onload = () => resolve();

    document.head.append(s);
  });
  libs[library] = p;
  return p;
}

/**
 * Loads a number of named Firebase libaries (or their cached previous loads).
 *
 * @param {...string} names to load
 * @return {Promise<void[]>}
 */
export function loadFirebase(...names) {
  return Promise.all(names.map(internalLoad));
}
