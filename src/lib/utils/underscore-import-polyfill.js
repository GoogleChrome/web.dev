const seen = {};

/**
 * Provides a simple dynamic `import()` polyfill on `window._import`.
 *
 * Does not return the exports from the module: web.dev doesn't use import this way.
 *
 * @param {string} src
 * @return {!Promise<?>}
 */
window._import = (src) => {
  // Rollup generates relative paths, but they're all relative to top level.
  if (src.startsWith("./")) {
    src = src.substr(2);
  }

  // We only need this cache for Edge, as it doesn't fire onload for module
  // scripts that have already loaded, unlike every other browser. When Edge
  // support is dropped, we can just include the Promise below.
  const previous = seen[src];
  if (previous !== undefined) {
    return previous;
  }

  const p = new Promise((resolve, reject) => {
    const n = Object.assign(document.createElement("script"), {
      src: `/${src}`, // Rollup generates sources only in top-level
      type: "module",
      onload: () => resolve(),
      onerror: reject,
    });
    document.head.append(n);
  });

  seen[src] = p;
  return p;
};
