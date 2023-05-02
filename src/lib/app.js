/**
 * @fileoverview Site entrypoint.
 *
 * This is web.dev's core JS bundle; it includes unistore, and some basic
 * sw cleanup code.
 */

import {store} from './store';
import {loadAnalyticsScript} from './actions';
import removeServiceWorkers from './utils/sw-remove';

// This hides a legacy browser warning that can appear on the /measure page
// See .unsupported-notice in _page-header.scss
document.body.classList.remove('unresolved');

// Although discouraged (especially for longer videos), some video clips may have
// autoplay enabled. Disable it when prefers-reduced-motion is set, and ensure
// controls are enabled.
if (matchMedia('(prefers-reduced-motion)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((b) => {
    b.removeAttribute('autoplay');
    b.setAttribute('controls', '');
  });
}

function onGlobalStateChanged({cookiePreference}) {
  window.dataLayer.push({cookiePreference: cookiePreference});
}
loadAnalyticsScript();
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());

removeServiceWorkers();
