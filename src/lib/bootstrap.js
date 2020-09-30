/**
 * @fileoverview Bootstrap code run by all browsers inside `script defer`.
 *
 * Used to trigger basic Analytics, including with our known previous signed-in
 * state that was cached in `localStorage`.
 *
 *   * This file is built with Rollup, but separately to our core bundle: don't
 *     import any core site code as it'll be duplicated.
 *
 *   * It's run in all browsers as a regular script (not "module"), and this
 *     includes all ancient browsers, e.g., IE11 or older.
 *
 *   * It runs _before_ our core bundle (for supported browsers), as it inserts
 *     the "entrypoint" script tag as part of its work.
 */

import {dimensions, id, version} from 'webdev_analytics';
import entrypoint from 'webdev_entrypoint';
import {localStorage} from './utils/storage';
import removeServiceWorkers from './utils/sw-remove';

// @ts-ignore
window.ga =
  window.ga ||
  function () {
    (ga.q = ga.q || []).push(arguments);
  };
ga.l = +new Date();
ga('create', id);
ga('set', 'transport', 'beacon');
ga('set', 'page', window.location.pathname);
// nb. Analytics requires dimension values to be strings.
ga('set', dimensions.SIGNED_IN, localStorage['webdev_isSignedIn'] ? '1' : '0');
ga('set', dimensions.TRACKING_VERSION, version.toString());
ga('send', 'pageview');

// In future, we can feature-detect other things here and prevent loading core
// site code. This includes Shadow DOM.
const browserSupport = 'noModule' in HTMLScriptElement.prototype;
if (browserSupport) {
  const s = document.createElement('script');
  s.type = 'module';
  s.src = '/' + entrypoint;
  document.head.append(s);
} else {
  // If we've transitioned into becoming an unsupported browser, then any
  // previous Service Worker won't be updated. Aggressively remove on load.
  removeServiceWorkers();
}
