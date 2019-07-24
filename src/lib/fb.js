import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {store} from "./store";

export {firebase};

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
      userUrl: null,
    });
  }

  if (user) {
    store.setState({
      isSignedIn: true,
      user,
    });
    firestoreUserUnsubscribe = userRef().onSnapshot((snapshot) => {
      const data = snapshot.data() || {}; // is empty on new user
      store.setState({
        userUrl: data.userUrl || "",
      });
    });
  } else {
    store.setState({
      isSignedIn: false,
      user: null,
    });
  }
});

export function userRef() {
  const state = store.getState();
  if (!state.user) {
    return null;
  }
  return firestore.collection("users").doc(state.user.uid);
}

// Sign in the user
export async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();

  let user;
  try {
    const res = await firebase.auth().signInWithPopup(provider);
    user = res.user;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('error', err);
  }

  return user;
}

// Sign out the user
export async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('error', err);
  }
}
