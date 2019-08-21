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
import "./components/Search";
import "./components/UrlChooser";
import "./components/UrlChooserContainer";
import "./components/Codelab";
import "./components/Header";
import "./components/SideNav";
import {store} from "./store";
import "focus-visible";

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
