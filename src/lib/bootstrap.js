/**
 * @fileoverview Site bootstrap code.
 *
 * This should not import unrelated code, and exists purely to load relevant polyfills and then
 * app.js (or TODO: entrypoints).
 */

import config from "./bootstrap-config";
import "@webcomponents/webcomponentsjs/webcomponents-loader.js";

console.info("web.dev", config.version);

WebComponents.waitFor(async () => {
  return new Promise((resolve, reject) => {
    // nb. import() is fairly well supported (although not as much as raw modules), but we just
    // don't need it
    const s = document.createElement("script");
    s.type = "module";
    s.onerror = reject;
    s.onload = () => resolve();
    s.src = "/app.js";
    document.head.appendChild(s);
  });
});
