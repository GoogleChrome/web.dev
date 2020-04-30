import './components/ProfileSwitcherContainer';
import './components/Header';
import './components/SideNav';
import './components/SnackbarContainer';
import './components/Search';
import {store} from './store';
import 'focus-visible';
import './analytics';

// Configures global page state
function onGlobalStateChanged({isSignedIn, isPageLoading}) {
  document.body.classList.toggle('lh-signedin', isSignedIn);

  const progress = document.querySelector('.w-loading-progress');
  progress.hidden = !isPageLoading;

  const main = document.querySelector('main');
  if (isPageLoading) {
    main.setAttribute('aria-busy', 'true');
  } else {
    main.removeAttribute('aria-busy');
  }

  // Cache whether the user was signed in, to help prevent FOUC in future and
  // for Analytics, as this can be read synchronosly and Firebase's auth takes
  // ~ms to arrive.
  localStorage['webdev_isSignedIn'] = isSignedIn ? 'probably' : '';
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());
