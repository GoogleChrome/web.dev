/**
 * @fileoverview Site entrypoint.
 *
 * This is web.dev's core JS bundle; it includes unistore, and some basic
 * sw cleanup code.
 */

import {store} from './store';
import {localStorage} from './utils/storage';
import removeServiceWorkers from './utils/sw-remove';

// This hides a legacy browser warning that can appear on the /measure page
// See .unsupported-notice in _page-header.scss
document.body.classList.remove('unresolved');

// Configures global page state (loading, signed in).
function onGlobalStateChanged({isSignedIn}) {
  document.body.classList.toggle('lh-signedin', isSignedIn);

  // Cache whether the user was signed in, to help prevent FOUC in future and
  // for Analytics, as this can be read synchronosly and Firebase's auth takes
  // ~ms to arrive.
  localStorage['webdev_isSignedIn'] = isSignedIn ? 'probably' : '';
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());

removeServiceWorkers();
