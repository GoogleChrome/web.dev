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
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());
