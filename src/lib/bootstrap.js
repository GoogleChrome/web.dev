/**
 * @fileoverview Site bootstrap code.
 *
 * This should import minimal site code, as it exists to load relevant polyfills and then the
 * correct entrypoint via our router.
 */

import config from "./bootstrap-config";
import "@webcomponents/webcomponentsjs/webcomponents-loader.js";
import {router} from "./router";

console.info("web.dev", config.version);

WebComponents.waitFor(async () => {
  // Run as long-lived router w/ history & "<a>" bindings
  // Also immediately calls `run()` handler for current location, loading its
  // required JS entrypoint
  router.listen();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
