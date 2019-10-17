/**
 * Provides a simple dynamic `import()` polyfill on `window._import`.
 *
 * Does not return the exports from the module: web.dev doesn't use import this way.
 *
 * @param {string} src
 * @return {!Promise<?>}
 */
window._import = (src) => {
  return new Promise((resolve, reject) => {
    const n = Object.assign(document.createElement("script"), {
      src: `/${src}`, // Rollup generates sources only in top-level
      type: "module",
      onload: () => resolve(),
      onerror: reject,
    });
    // nb. This is a noop for modules which are already loaded.
    document.head.append(n);
    n.remove();
  });
};
