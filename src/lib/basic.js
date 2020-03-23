/**
 * @fileoverview Run by all browsers in `script defer`.
 *
 * This file is passed through Rollup, but separately to our core bundle.
 */

import {dimensions, id, version} from "webdev_analytics";

let localStorage;
try {
  localStorage = window.localStorage;
} catch (e) {
  // some browsers don't let us access this
}
localStorage = localStorage || {};

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', id);
ga('set', 'transport', 'beacon');
ga('set', dimensions.SIGNED_IN, localStorage["webdev_isSignedIn"] ? 1 : 0);
ga('set', dimensions.TRACKING_VERSION, version);
ga('send', 'pageview');
