import {store} from "./store";
import * as loader from "./fb-loader";

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

const firebaseLoadError = (err) => {
  console.warn("failed to load firebase library", err);
};

// Load standard Firebase libraries (app and auth).
const firebaseReady = loader.loadAll("app", "auth").then(() => {
  firebase.initializeApp(firebaseConfig);
});

firebaseReady.catch(firebaseLoadError);

/**
 * Loads the Firestore library (as well as waiting for Firebase generally). This is a method as
 * it's only needed once the a user is signed in.
 *
 * @return {!Promise<!Object>}
 */
const firestoreLoader = (function() {
  let p;
  return () => {
    p =
      p ||
      Promise.all([firebaseReady, loader.load("firestore")]).then(() => {
        return firebase.firestore();
      });
    return p;
  };
})();

// Listen for the user's signed in state and update the store.
firebaseReady.then(() => {
  let firestoreUserUnsubscribe = null;

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
    const onUserSnapshot = (snapshot) => {
      const state = store.getState();
      const isInitialSnapshot = state.userUrl === null;

      // We expect the user snapshot to look like:
      // {
      //   currentUrl: String,         # current used URL
      //   urls: {String: Timestamp},  # URL to first time used (including current URL)
      // }
      const data = snapshot.data() || {}; // is empty on new user

      const userUrl = data.currentUrl || "";
      const prevSeen = (data.urls && data.urls[userUrl]) || null;
      const userUrlSeen = prevSeen ? prevSeen.toDate() : null;

      // Request results if this is the first snapshot and they have a saved URL.
      let userUrlResultsPending = isInitialSnapshot && userUrl;

      // But don't request results if there's an active fetch or a URL was set pre-signin.
      if (state.activeLighthouseUrl || state.userUrl === userUrl) {
        userUrlResultsPending = false;
      }

      store.setState({
        userUrlSeen,
        userUrl,
        userUrlResultsPending,
      });
    };

    // This unsubscribe function is used if the user signs out. However, the user's row cannot be
    // watched until the Firestore library is ready, so wrap the actual internal unsubscribe call.
    firestoreUserUnsubscribe = (function() {
      let internalUnsubscribe;
      let unsubscribed = false;

      userRef()
        .then((ref) => {
          if (!unsubscribed) {
            return; // signed out before Firestore library showed up
          }
          internalUnsubscribe = ref.onSnapshot(onUserSnapshot);
        })
        .catch(firebaseLoadError);

      return () => {
        unsubscribed = true;
        if (internalUnsubscribe) {
          internalUnsubscribe();
        }
      };
    })();
  });
});

async function userRef() {
  const state = store.getState();
  if (!state.user) {
    return null;
  }

  const firestore = await firestoreLoader();
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
  const ref = await userRef();
  if (!ref) {
    return null; // not signed in so user has never seen this site
  }

  const firestore = await firestoreLoader();
  const p = firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data() || {};

    // nb. If the userUrl matches, we can't actually just return, because Firestore demands that
    // every document read during a transaction is written again.

    const update = {
      currentUrl: url,
    };

    const prevSeen = (data.urls && data.urls[url]) || null;
    if (prevSeen) {
      // nb. There's already a valid timestamp here, so don't replace it with a future time,
      // but grab it so we can inform a signed-in caller.
      const cand = prevSeen.toDate();
      if (cand.getTime() && cand.getTime() < auditedOn.getTime()) {
        auditedOn = cand; // take earliest date
      }
    } else if (auditedOn && auditedOn.getTime()) {
      // Set the timestamp of this run, so the user gets runs from it and forward in future.
      update.urls = {
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
  await firebaseReady;
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
  await firebaseReady;
  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.error("error", err);
  }
}
