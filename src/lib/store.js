import createStore from "unistore";
import devtools from "unistore/devtools";

/* eslint-disable require-jsdoc */

const initialState = {
  // The first time the app boots we won't know whether the user is signed
  // in or out.
  // While we check, we should put things into an indeterminate state so we
  // don't render incorrect UI.
  checkingSignedInState: true,

  // The user has successfully signed in.
  isSignedIn: false,
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

  isSideNavExpanded: false,
  isSearchExpanded: false,

  // When a user lands on the page, check if they have accepted our
  // cookie policy.
  userAcceptsCookies: false,

  // Handle hiding/showing the snackbar.
  showingSnackbar: false,
  snackbarType: null,
};

const store = devtools(createStore(initialState));

export {store};
