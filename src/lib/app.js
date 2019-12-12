import "./components/ProfileSwitcherContainer";
import "./components/Header";
import "./components/SideNav";
import "./components/SnackbarContainer";
import "./components/Search";
import "./components/CopyCode";
import {store} from "./store";
import "focus-visible";
import "./analytics";
import {checkIfUserAcceptsCookies} from "./actions";

// Configures global page state
function onGlobalStateChanged({isSignedIn, isPageLoading}) {
  document.body.classList.toggle("lh-signedin", isSignedIn);

  const progress = document.querySelector(".w-loading-progress");
  progress.hidden = !isPageLoading;

  const main = document.querySelector("main");
  if (isPageLoading) {
    main.setAttribute("aria-busy", "true");
  } else {
    main.removeAttribute("aria-busy");
  }
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());

// Give elements time to set up before kicking off state changes.
// This is useful for elements with CSS animations who need to have been
// rendered to the page at least once before they start transitioning.
// Currently this includes the Snackbar.
setTimeout(() => {
  checkIfUserAcceptsCookies();
}, 0);
