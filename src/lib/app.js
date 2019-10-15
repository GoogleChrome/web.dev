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
  const state = store.getState();
  if (state.isSignedIn) {
    document.body.classList.add("lh-signedin");
  } else {
    document.body.classList.remove("lh-signedin");
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
