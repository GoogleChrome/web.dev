import "../styles/all.scss";
import {router} from "./router";
import "./components/ProfileSwitcherContainer";
import "./components/ProgressBar";
import "./components/SparklineChart";

// Run as long-lived router w/ history & "<a>" bindings
// Also immediately calls `run()` handler for current location
router.listen();
