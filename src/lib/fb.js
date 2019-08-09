import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {requestFetchReports} from "./actions";
import {store} from "./store";

/* eslint-disable require-jsdoc */

const firebaseConfig = {
  apiKey: "AIzaSyBjcWKserQhn4mygIluGr9eTMfR_S0PDEU",
  authDomain: "v2-prototype.firebaseapp.com",
  databaseURL: "https://v2-prototype.firebaseio.com",
  projectId: "v2-prototype",
  storageBucket: "",
  messagingSenderId: "960947587576",
  appId: "1:960947587576:web:b8e4ff1671c6c131",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

let firestoreUserUnsubscribe = null;

// Listen for the user's signed in state and update the store.
firebase.auth().onAuthStateChanged((user) => {
  store.setState({checkingSignedInState: false});
  if (firestoreUserUnsubscribe) {
    firestoreUserUnsubscribe();
    firestoreUserUnsubscribe = null;

    // Clear Firestore values here, so they don't persist between signins.
    store.setState({
      userUrlSeen: null,
      userUrl: null,
    });
  }

  if (!user) {
    store.setState({
      isSignedIn: false,
      user: null,
    });
    return;
  }

  store.setState({
    isSignedIn: true,
    user,
  });
  firestoreUserUnsubscribe = userRef().onSnapshot((snapshot) => {
    const state = store.getState();
    const isInitialSnapshot = state.userUrl === null;

    const data = snapshot.data() || {}; // is empty on new user

    const userUrl = data.userUrl || "";
    const prevSeen = (data.userUrlSeen && data.userUrlSeen[userUrl]) || null;
    const userUrlSeen = prevSeen ? prevSeen.toDate() : null;

    store.setState({
      userUrlSeen,
      userUrl,
    });
    if (state.activeLighthouseUrl || state.userUrl === userUrl) {
      return; // ignore if Lighthouse is running or this URL isn't a change
    }

    // TODO(samthor): This will request reports as soon as the user is signed in, regardless of
    // what page they're on. It should only request if we're on /measure.
    if (isInitialSnapshot && data.userUrl) {
      const state = store.getState();
      requestFetchReports(state.userUrl, state.userUrlSeen);
    }
  });
});

export function userRef() {
  const state = store.getState();
  if (!state.user) {
    return null;
  }
  return firestore.collection("users").doc(state.user.uid);
}

/**
 * Updates the user's row in Firestore (if signed in) with an updated URL and optional audit time.
 *
 * @param {string} url to update the user's row with
 * @param {!Date} auditedOn of the most recent Lighthouse run
 * @return {!Date} the earliest audit seen for this URL
 */
export async function saveUserUrl(url, auditedOn = null) {
  const ref = userRef();
  if (!ref) {
    return null; // not signed in so user has never seen this site
  }

  const p = firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data() || {};

    // nb. If the userUrl matches, we can't actually just return, because Firestore demands that
    // every document read during a transaction is written again.

    const update = {
      userUrl: url,
    };

    const prevSeen = (data.userUrlSeen && data.userUrlSeen[url]) || null;
    if (prevSeen) {
      // nb. There's already a valid timestamp here, so don't replace it with a future time,
      // but grab it so we can inform a signed-in caller.
      const cand = prevSeen.toDate();
      if (cand.getTime() && cand.getTime() < auditedOn.getTime()) {
        auditedOn = cand; // take earliest date
      }
    } else if (auditedOn && auditedOn.getTime()) {
      // Set the timestamp of this run, so the user gets runs from it and forward in future.
      update.userUrlSeen = {
        [url]: auditedOn,
      };
    }

    return transaction.set(ref, update, {merge: true});
  });

  try {
    await p;
  } catch (err) {
    // Note: We don't plan to do anything here. If we can't write to Firebase, we can still
    // try to invoke Lighthouse with the new URL.
    console.warn("could not write URL to Firestore", err);
  }

  return auditedOn;
}

// Sign in the user
export async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();

  let user;
  try {
    const res = await firebase.auth().signInWithPopup(provider);
    user = res.user;
  } catch (err) {
    console.error("error", err);
  }

  return user;
}

// Sign out the user
export async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.error("error", err);
  }
}
