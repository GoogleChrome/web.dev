import {firebaseConfig} from 'webdev_config';
import {store} from './store';
import {clearSignedInState} from './actions';
import loadFirebase from './utils/firebase-loader';
import {trackError} from './analytics';

const firebasePromise = loadFirebase('app', 'auth', 'performance').then(
  () => window.firebase,
);
firebasePromise.then(initialize).catch((err) => {
  console.error('failed to load Firebase', err);
  trackError(err, 'firebase load');
});

const firestorePromiseLoader = (() => {
  let p;
  return () => {
    if (p) {
      return p;
    }
    // We don't have to block on the top-level Promise, as the scripts run
    // in-order of being added to the page (async=false).
    p = loadFirebase('firestore').then(() => {
      const firestore = window.firebase.firestore();
      return firestore;
    });
    return p;
  };
})();

function initialize(firebase) {
  firebase.initializeApp(firebaseConfig);
  firebase.performance(); // initialize performance monitoring

  let firestoreUserUnsubscribe = () => {};
  let lastSavedUrl = null;

  const onUserSnapshot = (snapshot) => {
    let saveNewUrlToState = false;

    // We expect the user snapshot to look like:
    // {
    //   currentUrl: String,         # current URL saved to Firestore
    //   urls: {String: Timestamp},  # URL to first time used (including current URL)
    // }
    const data = snapshot.data() || {}; // is empty on new user
    const savedUrl = data.currentUrl || '';

    const {userUrl, userUrlSeen, activeLighthouseUrl} = store.getState();
    if (activeLighthouseUrl !== null) {
      // Do nothing, as the active URL action will eventually write its results.
      // This will also trigger a write to Firestore.
    } else if (lastSavedUrl && lastSavedUrl !== savedUrl) {
      // The user changed their target URL in another browser. Update it.
      // This doesn't fire on the first snapshot as |lastSavedUrl| begins
      // as null.
      saveNewUrlToState = true;
    } else if (!userUrl) {
      // Update to remote if there was no URL run before signin.
      saveNewUrlToState = true;
    } else if (!lastSavedUrl && userUrl) {
      // This is the first snapshot from Firebase, but the user has a local URL.
      // The user has run Lighthouse, but then signed in. Save the new run
      // to Firebase.
      saveUserUrl(userUrl, userUrlSeen);
      lastSavedUrl = userUrl;
      // Return early as we preempt the Firestore snapshot via lastSavedUrl
      return;
    } else {
      // Do nothing, as the last remote URL is already up-to-date. This occurs
      // if a snapshot was triggered for a field we don't care about.
    }
    lastSavedUrl = savedUrl;

    // The URL changed, so record it from remote, and optionally indicate that
    // <web-lighthouse-scores-container> should request new content when it
    // appears on the page.
    if (saveNewUrlToState) {
      const seen = (data.urls && data.urls[savedUrl]) || null;
      const userUrlSeen = seen ? seen.toDate() : null;
      const userUrlResultsPending = Boolean(savedUrl); // only fetch results if the URL was set

      store.setState({
        userUrl: savedUrl,
        userUrlSeen,
        userUrlResultsPending,
      });
    }
  };

  // Listen for the user's signed in state and update the store.
  firebase.auth().onAuthStateChanged((user) => {
    store.setState({checkingSignedInState: false});
    firestoreUserUnsubscribe();

    if (!user) {
      clearSignedInState();
      return;
    }

    // Don't clear userUrl, as the user might have requested a Lighthouse prior to signing in, and
    // there's an active action.
    store.setState({
      isSignedIn: true,
      user,
    });
    lastSavedUrl = null;

    // This unsubscribe function is used if the user signs out. However, the user's row cannot be
    // watched until the Firestore library is ready, so wrap the actual internal unsubscribe call.
    firestoreUserUnsubscribe = (function () {
      let internalUnsubscribe = null;
      let unsubscribed = false;

      userRef()
        .then((ref) => {
          if (!unsubscribed) {
            internalUnsubscribe = ref.onSnapshot(onUserSnapshot);
          }
        })
        .catch((err) => {
          console.warn('failed to load Firestore library', err);
          trackError(err, 'firestore load');
        });

      return () => {
        unsubscribed = true;
        if (internalUnsubscribe) {
          internalUnsubscribe();
          internalUnsubscribe = null;
        }
      };
    })();
  });
}

/**
 * Gets the Firestore reference to the user's document.
 *
 * @return {Promise<Object>}
 */
async function userRef() {
  const state = store.getState();
  if (!state.user) {
    return null;
  }

  const firestore = await firestorePromiseLoader();
  return firestore.collection('users').doc(state.user.uid);
}

/**
 * Updates the user's row in Firestore (if signed in) with an updated URL and optional audit time.
 *
 * @param {string} url to update the user's row with
 * @param {!Date} auditedOn of the most recent Lighthouse run
 * @return {Promise<Date>} the earliest audit seen for this URL
 */
export async function saveUserUrl(url, auditedOn = null) {
  const ref = await userRef();
  if (!ref) {
    return null; // not signed in so user has never seen this site
  }

  // This must exist, as userRef() forces Firestore to be loaded.
  const firestore = await firestorePromiseLoader();
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
    console.warn('could not write URL to Firestore', err);
    trackError(err, 'write URL');
  }

  return auditedOn;
}

/**
 * Request that the user signs in. Resolves on completion.
 *
 * @return {Promise<Object>} the auth user
 */
export async function signIn() {
  let user = null;
  try {
    await firebasePromise;
    const provider = new firebase.auth.GoogleAuthProvider();
    const res = await firebase.auth().signInWithPopup(provider);
    user = res.user;
  } catch (err) {
    console.error('signIn error', err);
    trackError(err, 'signIn');
  }

  return user;
}

/**
 * Requests that the user signs out.
 */
export async function signOut() {
  try {
    await firebasePromise;
    await firebase.auth().signOut();
  } catch (err) {
    console.error('signOut error', err);
    trackError(err, 'signOut');
  }
}
