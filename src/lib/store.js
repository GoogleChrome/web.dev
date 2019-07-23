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

  // The most recent URL measured.
  userUrl: null,
};

const store = devtools(createStore(initialState));

export {store};
