/**
 * @fileoverview Run by all browsers in `script defer`. Used to set up
 * Analytics, including with our known previous signed-in state that was cached
 * in `localStorage`.
 *
 * This file is built with Rollup, but separately to our core bundle.
 */

import {dimensions, id, version} from "webdev_analytics";
import {localStorage} from "./utils/storage";

// eslint-disable-next-line
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga("create", id);
ga("set", "transport", "beacon");
ga("set", dimensions.SIGNED_IN, localStorage["webdev_isSignedIn"] ? 1 : 0);
ga("set", dimensions.TRACKING_VERSION, version);
ga("send", "pageview");
