import createStore from "unistore";
import devtools from "unistore/devtools";
import getMeta from "./utils/meta";
import config from "webdev_config";

/* eslint-disable require-jsdoc */

const initialState = {
  // The first time the app boots we won't know whether the user is signed
  // in or out.
  // While we check, we should put things into an indeterminate state so we
  // don't render incorrect UI.
  checkingSignedInState: true,

  // The user has successfully signed in; default to cached value to help prevent FOUC
  isSignedIn: Boolean(window.localStorage["webdev_isSignedIn"]),
  user: null,

  // The most recent URL measured and the Date when it was first analyzed by the user.
  userUrlSeen: null,
  userUrl: null, // null for unknown/not signed-in, "" for unset

  // Whether a fetch should be made for the user's URL.
  userUrlResultsPending: false,

  // The URL currently being run through Lighthouse.
  activeLighthouseUrl: null,

  // The most recent Lighthouse results.
  lighthouseResult: null,

  // The most recent error from the Lighthouse CI, if any.
  lighthouseError: null,

  currentUrl: window.location.pathname,
  isOffline: Boolean(getMeta("offline")),
  isSideNavExpanded: false,
  isModalOpen: false,
  isSearchExpanded: false,

  // Whether to show the progressbar and mark the main content as busy, during a load.
  isPageLoading: false,

  // When a user lands on the page, check if they have accepted our
  // cookie policy.
  // We automatically accept cookies in dev and test environments so the cookie
  // banner doesn't interfere with tests.
  userAcceptsCookies: !config.prod,

  // Handle hiding/showing the snackbar.
  showingSnackbar: false,
  snackbarType: null,
};

let store;
if (config.prod) {
  store = createStore(initialState);
} else {
  store = devtools(createStore(initialState));
}

export {store};
