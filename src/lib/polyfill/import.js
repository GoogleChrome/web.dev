/**
 * Simple polyfill for the `import()` function.
 *
 * Limitations:
 *   - doesn't support exports from the passed module (but right now it's only used for entrypoints
 *     ...which have none)
 *   - won't resolve relative paths (which is the major "problem" with import() polyfills), but it
 *     is only used after a Rollup build which flattens all JS output
 *   - must be defined as a global on `window`
 *
 * @param {string} f to import
 * @return {!Promise<void>}
 */
window["polyfillImport"] = (function() {
  const cache = {};

  return (src) => {
    if (src in cache) {
      return cache["src"];
    }

    const p = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.onerror = reject;
      s.onload = () => resolve();
      s.src = src;
      document.head.appendChild(s);
    });
    cache[src] = p;
    return p;
  };
})();

export default window["polyfillImport"];
