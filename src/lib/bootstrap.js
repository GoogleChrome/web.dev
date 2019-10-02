/**
 * @fileoverview Site bootstrap code.
 *
 * This should not import unrelated code, and exists purely to load relevant polyfills and then
 * app.js (or TODO: entrypoints).
 */

import config from "./bootstrap-config";
import "@webcomponents/webcomponentsjs/webcomponents-loader.js";
import {router, entrypointLoaded} from "./router";
import entrypointForRoute from "./entrypoint-for-route";

console.info("web.dev", config.version);

WebComponents.waitFor(async () => {
  // ... only load the first entrypoint if the user hasn't changed URLs in the meantime
  if (!entrypointLoaded) {
    await entrypointForRoute(window.location.pathname.substr(1));
  }
});

// Run as long-lived router w/ history & "<a>" bindings
// Also immediately calls `run()` handler for current location
router.listen();
