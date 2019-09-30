/**
 * @fileoverview Site bootstrap code.
 *
 * This should not import unrelated code, and exists purely to load relevant polyfills and then the
 * correct entrypoint.
 */

import config from "./bootstrap-config";
import entrypointForRoute from "./bootstrap-entrypoint";
import "@webcomponents/webcomponentsjs/webcomponents-loader.js";

console.info("web.dev", config.version);

/**
 * @param {string} source to preload
 */
const preload = (function() {
  const cache = {};

  return (source) => {
    if (cache[source]) {
      return;
    }

    const node = Object.assign(document.createElement("link"), {
      type: "modulepreload",
      href: `/${source}`,
    });
    document.head.append(node);
    cache[source] = node;
  };
})();

/**
 * @param {string} source to insert as module
 * @return {!Promise<void>}
 */
const insertModuleScript = (function() {
  const cache = {};

  return (source) => {
    if (source in cache) {
      return cache[source];
    }

    // nb. import() is fairly well supported (although not as much as raw modules), but we just
    // don't need it
    const p = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module";
      s.onerror = reject;
      s.onload = () => resolve();
      s.src = `/${source}`;
      document.head.appendChild(s);
    });
    cache[source] = p;
    return p;
  };
})();

/**
 * Configures the page such that the correct entrypoint for the given pathname is loaded.
 *
 * @param {string} url
 * @return {!Promise<!HTMLScriptElement>}
 */
function updateEntrypoint(url) {
  const entrypoint = entrypointForRoute(url);
  const c = config.entrypoints[entrypoint];

  c.deps.forEach(preload);
  return insertModuleScript(c.name);
}

document.addEventListener("entrypoint-load", (ev) => {
  const {url, resolve} = ev.detail;
  resolve(updateEntrypoint(url));
});

WebComponents.waitFor(async () => {
  return updateEntrypoint(window.location.pathname.substr(1));
});

window.addEventListener("load", (e) => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register("/sw.js");
  }
});
