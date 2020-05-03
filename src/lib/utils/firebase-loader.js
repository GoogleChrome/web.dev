/**
 * @fileoverview Dynamic loading code for Firebase and libraries.
 */

/**
 * @type {!Object<!Promise>}
 */
const libs = {};

const firebasePrefix = '//www.gstatic.com/firebasejs/6.6.1';

/**
 * @param {string} library to preload
 * @return {!Promise} for library
 */
function internalPreload(library) {
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
 * Generates a function, which when called, preloads a number of named Firebase libraries (or
 * returns the cached version).
 *
 * This is helpful as we don't want to load e.g., Firestore before it's needed.
 *
 * @param {...string} names to preload
 * @return {function(): !Promise}
 */
export default function loader(...names) {
  let promise = null;

  return () => {
    if (promise) {
      return promise;
    }
    promise = Promise.all(names.map(internalPreload));
    return promise;
  };
}
