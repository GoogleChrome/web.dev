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

function onGlobalStateChanged({userAcceptsCookies}) {
  if (userAcceptsCookies) {
    loadAnalyticsScript();
  }
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());

removeServiceWorkers();
