/**
 * @fileoverview Run by all browsers in `script defer`. Used to trigger basic
 * Analytics, including with our known previous signed-in state that was cached
 * in `localStorage`.
 *
 *   * This file is built with Rollup, but separately to our core bundle: don't
 *     import any core site code as it'll be duplicated.
 *   * It's run in all browsers as a regular script (not "module"), and this
 *     includes all ancient browsers, e.g., IE11 or older.
 *   * It runs _before_ our core bundle (for supported browsers).
 */

import {dimensions, id, version} from 'webdev_analytics';
import {localStorage} from './utils/storage';

// eslint-disable-next-line
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', id);
ga('set', 'transport', 'beacon');
ga('set', dimensions.SIGNED_IN, localStorage['webdev_isSignedIn'] ? 1 : 0);
ga('set', dimensions.TRACKING_VERSION, version);
ga('send', 'pageview');

if ('noModule' in HTMLScriptElement.prototype) {
  function prepare() {
    const s = document.createElement('script');
    s.type = 'module';
    s.href = '/bootstrap.js';
    document.head.append(s);
  }
  if (document.readyState === 'complete') {
    prepare();
  } else {
    window.addEventListener('load', prepare);
  }
}
