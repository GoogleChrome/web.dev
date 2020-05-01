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
function preload(library) {
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
 * Preload a number of named Firebase libraries. This doesn't use dynamic import as Firebase code
 * must run in the global scope.
 *
 * @param {...string} names to preload
 * @return {!Promise}
 */
export default function(...names) {
  return Promise.all(names.map(preload));
}
