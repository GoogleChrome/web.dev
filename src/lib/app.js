import {router} from "./router";
import "./components/ProfileSwitcherContainer";
import "./components/ProgressBar";
import "./components/SparklineChart";
import "./components/LighthouseGauge";
import "./components/LighthouseScoresAudits";
import "./components/LighthouseScoresContainer";
import "./components/LighthouseScoresMeta";
import "./components/LighthouseScoresMetrics";
import "./components/LighthouseScoresStats";
import "./components/UrlChooser";
import "./components/UrlChooserContainer";
import "./components/Codelab";
import "./components/Header";
import "./components/SideNav";
import "./components/SnackbarContainer";
import "./components/Search";
import {store} from "./store";
import "focus-visible";
import "./analytics";
import {checkIfUserAcceptsCookies} from "./actions";

// Run as long-lived router w/ history & "<a>" bindings
// Also immediately calls `run()` handler for current location
router.listen();

// Configures global page state
function onGlobalStateChanged() {
  const {isSignedIn, isPageLoading} = store.getState();
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
onGlobalStateChanged();

// Give elements time to set up before kicking off state changes.
// This is useful for elements with CSS animations who need to have been
// rendered to the page at least once before they start transitioning.
// Currently this includes the Snackbar.
setTimeout(() => {
  checkIfUserAcceptsCookies();
}, 0);
