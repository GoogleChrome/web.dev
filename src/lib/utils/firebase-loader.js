/**
 * @fileoverview Dynamic loading code for Firebase and libraries.
 */

/**
 * @type {!Object<!Promise>}
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

    s.onerror = reject;
    s.onload = () => resolve();

    document.head.append(s);
  });
  libs[library] = p;
  return p;
}

/**
 * Generates a function, which when called, loads a number of named Firebase
 * libraries (or returns their cached loads).
 *
 * Returning a function here is helpful as we don't want to load e.g., Firestore
 * before it's needed.
 *
 * @param {...string} names to load
 * @return {function(): !Promise}
 */
export default function buildLoader(...names) {
  let promise = null;

  return () => {
    if (promise) {
      return promise;
    }
    promise = Promise.all(names.map(internalLoad));
    return promise;
  };
}
